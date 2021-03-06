/**
 * Progress bar.
 *
 * @copyright (c) 2017 Passbolt SARL
 * @licence GNU Affero General Public License http://www.gnu.org/licenses/agpl-3.0.en.html
 */

$(function () {

  // Goals the progress bar has to fullfill.
  var goals = null;

  /**
   * Close the dialog.
   */
  var closeDialog = function (ev) {
    ev.preventDefault();
    passbolt.message.emit('passbolt.progress.close-dialog');
  };

  /**
   * Update progress bar.
   */
  var updateProgressBar = function (message, completedGoals) {
    var percent = Math.round((100 * completedGoals) / goals);
    if (percent == 100) {
      message = 'completed';
    }
    if (message) {
      $('#js_progress_step_label', document).text(message);
    }
    $('#js_progress_percent', document).text(percent + '%');
    $('.progress-bar').css('width', percent + '%');
  };

  /**
   * Update goals.
   */
  var updateGoals = function (data) {
    goals = data;
  };

  /**
   * Init all the event listeners relative to view events.
   */
  var initEventsListeners = function () {
    return new Promise(function(resolve, reject) {
      $('.js-dialog-close').on('click', closeDialog);
      passbolt.message.on('passbolt.progress.update', updateProgressBar);
      passbolt.message.on('passbolt.progress.update-goals', updateGoals);
      resolve();
    });
  };

  /**
   * Init the progress bar.
   */
  var initProgressBar = function () {
    var width = 100;
    if (goals != null && goals !== 0) {
      width = 100 / goals / 2;
    }
    $('#js_progress_bar_container').css('width', width + '%');
  };

  /**
   * Error handler.
   *
   * @param error
   */
  var error = function (error) {
    throw error;
  };

  /**
   * Initialize the progress dialog.
   */
  var init = function () {
    var searchParams = new URLSearchParams(window.location.href),
      title = searchParams.get('title');
    goals = searchParams.get('goals');

    // goals has to be an integer
    if (goals != null) {
      goals = parseInt(goals);
      if (Number.isNaN(goals)) {
        goals = null;
      }
    }

    passbolt.html.loadTemplate('body', 'progress/progress.ejs', 'html', {title: title})
      .then(initEventsListeners, error)
      .then(initProgressBar);
  };

  init();

});
