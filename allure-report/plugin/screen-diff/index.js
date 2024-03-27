(function () {
  const settings = allure.getPluginSettings('screen-diff', { diffType: 'diff' });

  function renderImage(src) {
    return (
      '<div class="screen-diff__container">' +
      '<img class="screen-diff__image" src="' +
      src +
      '">' +
      '</div>'
    );
  }

  function findImage(data, name) {
    if (data.testStage && data.testStage.attachments) {
      const matchedImage = data.testStage.attachments.filter(
        function (attachment) {
          return attachment.name === name;
        },
      )[0];
      if (matchedImage) {
        return 'data/attachments/' + matchedImage.source;
      }
    }
    return null;
  }

  function renderDiffContent(type, diffImage, actualImage, expectedImage) {
    if (type === 'diff') {
      if (diffImage) {
        return renderImage(diffImage);
      }
    }
    if (type === 'overlay' && expectedImage) {
      return (
        '<div class="screen-diff__overlay screen-diff__container">' +
        '<img class="screen-diff__image" src="' +
        expectedImage +
        '">' +
        '<div class="screen-diff__image-over">' +
        '<img class="screen-diff__image" src="' +
        actualImage +
        '">' +
        '</div>' +
        '</div>'
      );
    }
    if (actualImage) {
      return renderImage(actualImage);
    }
    return 'No diff data provided';
  }

  const TestResultView = Backbone.Marionette.View.extend({
    regions: {
      subView: '.screen-diff-view',
    },
    template () {
      return '<div class="screen-diff-view"></div>';
    },
    onRender () {
      const data = this.model.toJSON();
      const testType = data.labels.filter(function (label) {
        return label.name === 'testType';
      })[0];
      const diffImage = findImage(data, 'diff');
      const actualImage = findImage(data, 'actual');
      const expectedImage = findImage(data, 'expected');
      if (!testType || testType.value !== 'screenshotDiff') {
        return;
      }
      this.showChildView(
        'subView',
        new ScreenDiffView({
          diffImage,
          actualImage,
          expectedImage,
        }),
      );
    },
  });
  const ErrorView = Backbone.Marionette.View.extend({
    templateContext () {
      return this.options;
    },
    template (data) {
      return '<pre class="screen-diff-error">' + data.error + '</pre>';
    },
  });
  const AttachmentView = Backbone.Marionette.View.extend({
    regions: {
      subView: '.screen-diff-view',
    },
    template () {
      return '<div class="screen-diff-view"></div>';
    },
    onRender () {
      jQuery
        .getJSON(this.options.sourceUrl)
        .then(
          this.renderScreenDiffView.bind(this),
          this.renderErrorView.bind(this),
        );
    },
    renderErrorView (error) {
      console.log(error);
      this.showChildView(
        'subView',
        new ErrorView({
          error: error.statusText,
        }),
      );
    },
    renderScreenDiffView (data) {
      this.showChildView(
        'subView',
        new ScreenDiffView({
          diffImage: data.diff,
          actualImage: data.actual,
          expectedImage: data.expected,
        }),
      );
    },
  });

  var ScreenDiffView = Backbone.Marionette.View.extend({
    className: 'pane__section',
    events () {
      return {
        ['click [name="screen-diff-type-' + this.cid + '"]']:
          'onDiffTypeChange',
        'mousemove .screen-diff__overlay': 'onOverlayMove',
      };
    },
    initialize (options) {
      this.diffImage = options.diffImage;
      this.actualImage = options.actualImage;
      this.expectedImage = options.expectedImage;
      this.radioName = 'screen-diff-type-' + this.cid;
    },
    templateContext () {
      return {
        diffType: settings.get('diffType'),
        diffImage: this.diffImage,
        actualImage: this.actualImage,
        expectedImage: this.expectedImage,
        radioName: this.radioName,
      };
    },
    template (data) {
      if (!data.diffImage && !data.actualImage && !data.expectedImage) {
        return '';
      }

      return (
        '<h3 class="pane__section-title">Screen Diff</h3>' +
        '<div class="screen-diff__content">' +
        '<div class="screen-diff__switchers">' +
        '<label><input type="radio" name="' +
        data.radioName +
        '" value="diff"> Show diff</label>' +
        '<label><input type="radio" name="' +
        data.radioName +
        '" value="overlay"> Show overlay</label>' +
        '</div>' +
        renderDiffContent(
          data.diffType,
          data.diffImage,
          data.actualImage,
          data.expectedImage,
        ) +
        '</div>'
      );
    },
    adjustImageSize (event) {
      const overImage = this.$(event.target);
      overImage.width(overImage.width());
    },
    onRender () {
      const diffType = settings.get('diffType');
      this.$('[name="' + this.radioName + '"][value="' + diffType + '"]').prop(
        'checked',
        true,
      );
      if (diffType === 'overlay') {
        this.$('.screen-diff__image-over img').on(
          'load',
          this.adjustImageSize.bind(this),
        );
      }
    },
    onOverlayMove (event) {
      const pageX = event.pageX;
      const containerScroll = this.$('.screen-diff__container').scrollLeft();
      const elementX = event.currentTarget.getBoundingClientRect().left;
      const delta = pageX - elementX + containerScroll;
      this.$('.screen-diff__image-over').width(delta);
    },
    onDiffTypeChange (event) {
      settings.save('diffType', event.target.value);
      this.render();
    },
  });
  allure.api.addTestResultBlock(TestResultView, { position: 'before' });
  allure.api.addAttachmentViewer('application/vnd.allure.image.diff', {
    View: AttachmentView,
    icon: 'fa fa-exchange',
  });
})();
