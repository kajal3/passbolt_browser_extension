/**
 * Passbolt login redirection setup step.
 *
 * @copyright (c) 2017 Passbolt SARL
 * @licence GNU Affero General Public License http://www.gnu.org/licenses/agpl-3.0.en.html
 */
var passbolt = passbolt || {};
passbolt.setup = passbolt.setup || {};
passbolt.setup.steps = passbolt.setup.steps || {};

$(function () {

  /*
   * Step settings.
   */
  var step = {
    id: 'login_redirection',
    options: {
      workflow: 'install'
    }
  };

  /**
   * Implements init().
   * @returns {Promise}
   */
  step.init = function () {
    return new Promise(function(resolve, reject) {
      resolve();
    });
  };

  /**
   * Implements start().
   */
  step.start = function () {
    step.submit();
  };

  /**
   * Implements submit().
   * @returns {Promise}
   */
  step.submit = function () {
    return passbolt.setup.get()
      .then(step._validateAccount)
      .then(step._flushSetup)
      .then(function () {
        // Autologin.
        step._goToLogin();
      })
      .catch(function (error) {
        passbolt.setup.fatalError(error.message, error.data);
      });
  };

  /**
   * Implements cancel().
   * @returns Promise
   */
  step.cancel = function () {
    return new Promise(function(resolve, reject) {
      passbolt.setup.setActionState('cancel', 'processing');
      resolve();
    });
  };

  /* ==================================================================================
   *  Business functions
   * ================================================================================== */

  /**
   * Flush setup.
   *
   * If setup went fine, we don't need to keep the data as they are already stored
   * in user object.
   *
   * @returns {Promise}
   * @private
   */
  step._flushSetup = function () {
    return passbolt.request('passbolt.setup.flush')
      .then(null, function (error) {
        //@todo PASSBOLT-1471
        //console.log('error while flushing setup', error);
      });
  };

  /**
   * Go to login at the end of the setup.
   * @returns {Promise}
   * @private
   */
  step._goToLogin = function () {
    // Get domain from settings.
    return passbolt.request('passbolt.user.settings.get.domain')
      .then(function (domain) {
        var loginUrl = domain + "/auth/login";
        // Set timeout so the user has time to read the redirection message before actually being redirected.
        setTimeout(
          function () {
            window.location.href = loginUrl;
          },
          2000);
      });
  };

  /**
   * Validate account of the user on the server with data collected during the setup.
   *
   * @param setupData {array} Setup information
   * @returns {Promise}
   * @private
   */
  step._validateAccount = function (setupData) {
    if (step.options.workflow == 'install') {
      return passbolt.request('passbolt.setup.save', setupData);
    }
    else if (step.options.workflow == 'recover') {
      return passbolt.request('passbolt.setup.completeRecovery', setupData);
    }
  };

  passbolt.setup.steps[step.id] = step;

});
