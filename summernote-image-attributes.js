/* https://github.com/DiemenDesign/summernote-image-attributes */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('jquery'));
  } else {
    factory(window.jQuery);
  }
}(function ($) {
  var readFileAsDataURL = function (file) {
    return $.Deferred( function (deferred) {
      $.extend(new FileReader(),{
        onload: function (e) {
          var sDataURL = e.target.result;
          deferred.resolve(sDataURL);
        },
        onerror: function () {
          deferred.reject(this);
        }
      }).readAsDataURL(file);
    }).promise();
  };
  $.extend(true,$.summernote.lang, {
    'ja-JP': { /* JP Japanese(Default Language) */
      imageAttributes: {
        dialogTitle: '詳細設定',
        tooltip: '詳細設定',
        tabImage: '画像',
          src: 'Source',
          browse: 'Browse',
          title: 'Title',
          alt: 'Alt Text',
          dimensions: 'Dimensions',
        tabAttributes: 'Attributes',
          class: 'Class',
          style: 'Style',
          role: 'Role',
        tabLink: 'リンク',
          linkHref: 'URL',
          linkTarget: 'Target',
          linkTargetInfo: '選択可能: _self, _blank, _top, _parent',
          linkClass: 'Class',
          linkStyle: 'Style',
          linkRel: 'Rel',
          linkRelInfo: 'Options: alternate, author, bookmark, help, license, next, nofollow, noreferrer, prefetch, prev, search, tag',
          linkRole: 'Role',
        tabUpload: 'Upload',
          upload: 'Upload',
        tabBrowse: 'Browse',
        editBtn: 'OK'
      }
    }
  });
  $.extend($.summernote.options, {
    imageAttributes: {
      icon: '<i class="note-icon-pencil"/>',
      removeEmpty: true,
      disableUpload: false,
      imageFolder: ''
    }
  });
  $.extend($.summernote.plugins, {
    'imageAttributes': function (context) {
      var self      = this,
          ui        = $.summernote.ui,
          $note     = context.layoutInfo.note,
          $editor   = context.layoutInfo.editor,
          $editable = context.layoutInfo.editable,
          options   = context.options,
          lang      = options.langInfo,
          imageAttributesLimitation = '';
      if (options.maximumImageFileSize) {
        var unit = Math.floor(Math.log(options.maximumImageFileSize) / Math.log(1024));
        var readableSize = (options.maximumImageFileSize/Math.pow(1024,unit)).toFixed(2) * 1 + ' ' + ' KMGTP'[unit] + 'B';
        imageAttributesLimitation = '<small class="help-block note-help-block">' + lang.image.maximumFileSize + ' : ' + readableSize+'</small>';
      }
      context.memo('button.imageAttributes', function() {
        var button = ui.button({
          contents: options.imageAttributes.icon,
          tooltip:  lang.imageAttributes.tooltip,
          click: function () {
            context.invoke('imageAttributes.show');
          }
        });
        return button.render();
      });
      this.initialize = function () {
        var $container = options.dialogsInBody ? $(document.body) : $editor;
        var timestamp = Date.now();
        var body = '<ul class="nav note-nav nav-tabs note-nav-tabs">' +
                   '  <li class="nav-item"><a class="nav-link active" href="#note-imageAttributes-link' + timestamp + '" data-toggle="tab">' + lang.imageAttributes.tabLink + '</a></li>';
        if (options.imageAttributes.disableUpload == false) {
           body += '  <li><a href="#note-imageAttributes-upload' + timestamp + '" data-toggle="tab">' + lang.imageAttributes.tabUpload + '</a></li>';
        }
        body +=    '</ul>' +
                   '<div class="tab-content note-tab-content">' +
                   // Tab 3
                   '  <div class="tab-pane note-tab-pane fade in active show" id="note-imageAttributes-link' + timestamp + '">' +
                   '    <div class="note-form-group form-group note-group-imageAttributes-link-href">' +
                   '      <label class="control-label note-form-label col-xs-3">' + lang.imageAttributes.linkHref + '</label>' +
                   '      <div class="input-group note-input-group col-xs-12 col-sm-9">' +
                   '        <input class="note-imageAttributes-link-href form-control note-form-control note-input" type="text">' +
                   '      </div>' +
                   '    </div>' +
                   '    <div class="note-form-group form-group note-group-imageAttributes-link-target">' +
                   '      <label class="control-label note-form-label col-xs-3">' + lang.imageAttributes.linkTarget + '</label>' +
                   '      <div class="input-group note-input-group col-xs-12 col-sm-9">' +
                   '        <input class="note-imageAttributes-link-target form-control note-form-control note-input" type="text">' +
                   '      </div>' +
                   '      <small class="help-block note-help-block text-right">' + lang.imageAttributes.linkTargetInfo + '</small>' +
                   '    </div>' +
                   '  </div>';
      if (options.imageAttributes.disableUpload == false) {
                   // Tab 4
        body +=    '  <div class="tab-pane note-tab-pane" id="note-imageAttributes-upload' + timestamp + '">' +
                   '   <label class="control-label note-form-label col-xs-3">' + lang.imageAttributes.upload + '</label>' +
                   '   <div class="input-group note-input-group col-xs-12 col-sm-9">' +
                   '     <input class="note-imageAttributes-input form-control note-form-control note-input" type="file" name="files" accept="image/*" multiple="multiple" />' +
                         imageAttributesLimitation +
                   '    </div>' +
                   '  </div>';
        }
        // Tab 1
        body +=    '  <div class="tab-pane note-tab-pane fade in active" id="note-imageAttributes' + timestamp + '">' +
                   '    <div class="note-form-group form-group note-group-imageAttributes-url">' +
                   '      <label class="control-label note-form-label col-sm-3">' + lang.imageAttributes.src + '</label>' +
                   '      <div class="input-group note-input-group col-xs-12 col-sm-9">' +
                   '        <input class="note-imageAttributes-src form-control note-form-control note-input" type="text" />' +
//                   '        <span class="input-group-btn">' +
//                   '          <button class="btn btn-default class="note-imageAttributes-browse">' + lang.imageAttributes.browse + '</button>' +
//                   '        </span>' +
                   '      </div>' +
                   '    </div>' +
                   '  </div>' +
                   '</div>';
        this.$dialog=ui.dialog({
          title:  lang.imageAttributes.dialogTitle,
          body:   body,
          footer: '<button href="#" class="btn btn-primary note-btn note-btn-primary note-imageAttributes-btn">' + lang.imageAttributes.editBtn + '</button>'
        }).render().appendTo($container);
      };
      this.destroy = function () {
        ui.hideDialog(this.$dialog);
        this.$dialog.remove();
      };
      this.bindEnterKey = function ($input,$btn) {
        $input.on('keypress', function (e) {
          if (e.keyCode === 13) $btn.trigger('click');
        });
      };
      this.bindLabels = function () {
        self.$dialog.find('.form-control:first').focus().select();
        self.$dialog.find('label').on('click', function () {
          $(this).parent().find('.form-control:first').focus();
        });
      };
      this.show = function () {
        var $img    = $($editable.data('target'));
        var imgInfo = {
          imgDom:  $img,
          src:     $img.attr('src'),
          imgLink: $($img).parent().is("a") ? $($img).parent() : null
        };
        this.showImageAttributesDialog(imgInfo).then( function (imgInfo) {
          ui.hideDialog(self.$dialog);
          var $img = imgInfo.imgDom;
          if (options.imageAttributes.removeEmpty) {
            if (imgInfo.src)    $img.attr('src',   imgInfo.src);    else $img.attr('src', '#');
          } else {
            if (imgInfo.src)    $img.attr('src',   imgInfo.src);    else $img.attr('src', '#');
          }
          if($img.parent().is("a")) $img.unwrap();
          if (imgInfo.linkHref) {
            var linkBody = '<a';
            linkBody += ' href="' + imgInfo.linkHref + '" target="' + imgInfo.linkTarget + '"';
            linkBody += '></a>';
            $img.wrap(linkBody);
          }
          $note.val(context.invoke('code'));
          $note.change();
        });
      };
      this.showImageAttributesDialog = function (imgInfo) {
        return $.Deferred( function (deferred) {
          var $imageInput  = self.$dialog.find('.note-imageAttributes-input'),
              $imageSrc    = self.$dialog.find('.note-imageAttributes-src'),
              $linkHref    = self.$dialog.find('.note-imageAttributes-link-href'),
              $linkTarget  = self.$dialog.find('.note-imageAttributes-link-target'),
              $editBtn     = self.$dialog.find('.note-imageAttributes-btn');
          $linkHref.val();
          $linkTarget.val();
          if (imgInfo.imgLink) {
            $linkHref.val(imgInfo.imgLink.attr('href'));
            $linkTarget.val(imgInfo.imgLink.attr('target'));
          }
          ui.onDialogShown(self.$dialog, function () {
            context.triggerEvent('dialog.shown');
            $imageInput.replaceWith(
              $imageInput.clone().on('change', function () {
                var callbacks = options.callbacks;
                if (callbacks.onImageUpload) {
                  context.triggerEvent('image.upload',this.files[0]);
                } else {
                  readFileAsDataURL(this.files[0]).then( function (dataURL) {
                    $imageSrc.val(dataURL);
                  }).fail( function () {
                    context.triggerEvent('image.upload.error');
                  });
                }
              }).val('')
            );
            $editBtn.click( function (e) {
              e.preventDefault();
              deferred.resolve({
                imgDom:     imgInfo.imgDom,
                src:        $imageSrc.val(),
                linkHref:   $linkHref.val(),
                linkTarget: $linkTarget.val()
              }).then(function (img) {
                context.triggerEvent('change', $editable.html());
              });
            });
            $imageSrc.val(imgInfo.src);
            self.bindEnterKey($editBtn);
            self.bindLabels();
          });
          ui.onDialogHidden(self.$dialog, function () {
            $editBtn.off('click');
            if (deferred.state() === 'pending') deferred.reject();
          });
          ui.showDialog(self.$dialog);
        });
      };
    }
  });
}));
