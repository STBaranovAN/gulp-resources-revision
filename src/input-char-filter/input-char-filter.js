(function($) {
	var methods = {
		init: function(options) {
			var defaultOptions = {
				errorMessage: 'The field contains wrong symbols',
				updateAttribute: 'data-original-title',
				errorMessagePaste: 'wrong characters have been replaced by spaces',
				errorMessageEmptyStringPaste: '',
				replacementByEmptyString: false
			};
			options = $.extend(defaultOptions, options);
			var $input = $(this);
			var tooltipHide = function(inp) {
				inp.removeAttr(options.updateAttribute);
				inp.tooltip('hide');
			};
			$input.on('keypress',
				function(e) {
					var $this = $(this);
					if (e.ctrlKey || e.which == 8 || e.which == 0) {
						return true;
					}
					if (e.which == 13 && $this.attr('data-preventEnterKey') != "true") {
						return true;
					}

					var s = String.fromCharCode(e.which);
					var acceptResult = options.rule.test(s);

					var acceptMask = true;
					if ($this.attr('data-role') == 'maskedtextbox') {
						var testRule = $this.data("kendoMaskedTextBox").tokens[$this[0].selectionStart];
						if (testRule instanceof RegExp) {
							acceptMask = testRule.test(s);
						}
					}

					if (!acceptResult || !acceptMask) {
						//var tooltip = $this.data('bs.tooltip');
						//if (tooltip) {
						//    tooltip.destroy();
						//}
						$this.attr(options.updateAttribute, options.errorMessage).tooltip({
							container: 'body',
							placement: 'bottom',
							trigger: 'manual',
							template:
								'<div class="tooltip accept-char-tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
						});
						$this.tooltip('show');
					} else {
						tooltipHide($this);
					}
					return acceptResult;
				});
			$input.on('keydown',
				function(e) {
					var $this = $(this);
					// prevent backspace on empty input
					if (e.which == 8 && $this.val().length === 0) {
						e.preventDefault();
					}
				});
			$input.on('copy',
				function(e) {
					var event = (e.originalEvent || e);
					var isIe = window.clipboardData && window.clipboardData.getData;
					var format = isIe ? 'Text' : 'text/plain';
					var element = isIe ? window : event;
					element.clipboardData.setData(format, getValueCheckMask($(this), getSelectedText().toString()));
					event.preventDefault();
				});
			$input.on('paste',
				function(e) {
					var event = (e.originalEvent || e);
					var text = undefined;
					var $this = $(this);
					var isIe = window.clipboardData && window.clipboardData.getData;
					if (isIe) { // IE
						text = window.clipboardData.getData('Text');
					} else if (event.clipboardData && event.clipboardData.getData) {
						text = event.clipboardData.getData('text/plain');
					}
					if (text) {
						var needReplaceFrenchQuotes = (/[«»]/gm).test(text);
						if (needReplaceFrenchQuotes) {
							text = text.replace(/[«»]/gm, '"');
						}
						var isTextValid = options.rule.test(text);
						var needReplace = !isTextValid &&
							$this.attr('data-role') != 'maskedtextbox' &&
							$this.attr('type') != 'password';
						var wrongPass = !isTextValid && $this.attr('type') == 'password';
						if (needReplace) {
							var replaced = options.rule.source;
							var result = "[^" +
								replaced.substring(replaced.indexOf("[") + 1, replaced.lastIndexOf("]")) +
								"]";
							var rx = new RegExp(result, "gm");

							if ($this.attr('data-role') == 'numerictextbox' ||
								options.replacementByEmptyString == true) {
								text = text.replace(rx, "");
								$this.attr(options.updateAttribute, options.errorMessagePaste).tooltip({
									container: 'body',
									placement: 'bottom',
									trigger: 'manual',
									template:
										'<div class="tooltip accept-char-tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
								});
							} else {
								var space = " ";
								var emptyString = "";
								if (options.rule.test(space))
									text = text.replace(rx, space);
								else {
									text = text.replace(rx, emptyString);
									options.errorMessagePaste = options.errorMessageEmptyStringPaste;
								}
								$this.attr(options.updateAttribute, options.errorMessagePaste).tooltip({
									container: 'body',
									placement: 'bottom',
									trigger: 'manual',
									template:
										'<div class="tooltip accept-char-tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
								});
							}

							$this.tooltip('show');
						}
						if (wrongPass) {

							e.preventDefault();
							$this.attr(options.updateAttribute, options.errorMessage).tooltip({
								container: 'body',
								placement: 'bottom',
								trigger: 'manual',
								template:
									'<div class="tooltip accept-char-tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
							});
							$this.tooltip('show');
						}
						if (needReplace) {
							event.preventDefault();
							var caretPos = this.selectionStart;
							var caretEnd = this.selectionEnd;
							var textAreaTxt = this.value;

							var maxLength = $this.attr('maxlength');
							if (maxLength && maxLength !== '') {
								var currentLength = textAreaTxt.length;
								var selectionLength = caretEnd - caretPos;
								var maxCharsToPaste = maxLength -
									currentLength +
									selectionLength;
								text = text.substring(0, maxCharsToPaste);
							}

							var pos = caretPos + text.length;
							var input = $(this);
							input.val(textAreaTxt.substring(0, caretPos) + text + textAreaTxt.substring(caretEnd));
							input.trigger("change");
							input[0].setSelectionRange(pos, pos);
							return true;

						} else {
							return true;
						}
					} else {
						event.preventDefault();
					}
				});
			$input.on('blur',
				function(e) {
					tooltipHide($(this));
				});
			$(window).on('scroll',
				function() {
					tooltipHide($input);
				});

			var id = guid();
			$(".content-scroll").on('scroll.' + id,
				function() {
					if ($($input.selector).length > 0)
						tooltipHide($input);
					else $(".content-scroll").off("scroll." + id);
				});
		}
	};

	function guid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}

		return s4() + s4() + '-' + s4();
	}

	function getValueCheckMask(element, value) {
		return $(element).attr('data-mask') ? value.replace(/_|\s/g, "").toUpperCase() : value;
	}

	function getSelectedText() {
		if (window.getSelection) { // all browsers, except IE before version 9
			return document.activeElement &&
				(document.activeElement.tagName.toLowerCase() == "textarea" ||
					document.activeElement.tagName.toLowerCase() == "input")
				? getSelectedTextFromInputTextarea()
				: window.getSelection().toString();
		} else { // Internet Explorer
			return document.selection.createRange ? document.selection.createRange().text : "";
		}
	}

	function getSelectedTextFromInputTextarea() {
		return document.activeElement.value.substring(document.activeElement.selectionStart,
			document.activeElement.selectionEnd);
	}

	var biaInputCharFilter = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on bia.input-char-filter');
		}
	};
	$.fn.biaInputCharFilter = biaInputCharFilter;
})(jQuery);
