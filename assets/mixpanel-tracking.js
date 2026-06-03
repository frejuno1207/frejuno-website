/*!
 * FREJUNO Mixpanel tracking
 * Quick Start scope: diagnosis funnel only.
 */
(function() {
  var MIXPANEL_TOKEN = 'accab28a95ca3c08d8fe02929ca731bd';
  var VERSION = '20260603-1';
  var DIAGNOSIS_VERSION = 'mvp_type_diagnosis_v3_7q';

  (function(f,b){
    if(!b.__SV){
      var e,g,i,h;
      window.mixpanel=b;
      b._i=[];
      b.init=function(e,f,c){
        function g(a,d){
          var b=d.split(".");
          if(b.length===2){a=a[b[0]];d=b[1];}
          a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)));};
        }
        var a=b;
        if(typeof c!=="undefined"){a=b[c]=[];}else{c="mixpanel";}
        a.people=a.people||[];
        a.toString=function(a){var d="mixpanel"; if(c!=="mixpanel"){d+="."+c;} if(!a){d+=" (stub)";} return d;};
        a.people.toString=function(){return a.toString(1)+".people (stub)";};
        i="disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
        for(h=0;h<i.length;h++){g(a,i[h]);}
        b._i.push([e,f,c]);
      };
      b.__SV=1.2;
      e=f.createElement("script");
      e.type="text/javascript";
      e.async=true;
      e.src="https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";
      g=f.getElementsByTagName("script")[0];
      g.parentNode.insertBefore(e,g);
    }
  })(document, window.mixpanel || []);

  function getSearchParam(name) {
    try { return new URLSearchParams(window.location.search).get(name); }
    catch (e) { return null; }
  }

  function getStored(key) {
    try { return localStorage.getItem(key); }
    catch (e) { return null; }
  }

  function pageName() {
    var path = window.location.pathname;
    if (path.indexOf('/diagnosis/diagnosis_lp') >= 0) return 'diagnosis_lp';
    if (path.indexOf('/diagnosis/mvp_type_diagnosis') >= 0) return 'type_diagnosis';
    if (path.indexOf('/diagnosis/conditions') >= 0) return 'conditions';
    if (path.indexOf('/types/') >= 0) return 'type_detail';
    if (path.indexOf('/me/') >= 0) return 'result_home';
    return path.replace(/^\//, '').replace(/\/$/, '') || 'home';
  }

  function baseProps() {
    return {
      app: 'frejuno_website',
      platform: 'web',
      page_name: pageName(),
      source: getSearchParam('src') || 'direct',
      share_code: getSearchParam('sc') || getStored('frejuno_share_code') || null,
      session_id: getStored('frejuno_session_id') || null,
      diagnosis_version: DIAGNOSIS_VERSION,
      tracking_version: VERSION
    };
  }

  function compact(value) {
    if (Array.isArray(value)) return value.join(',');
    if (value && typeof value === 'object') return JSON.stringify(value);
    return value;
  }

  function normalizeProperties(props) {
    var out = baseProps();
    props = props || {};
    Object.keys(props).forEach(function(key) {
      var normalizedKey = key
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
        .replace(/[^a-zA-Z0-9_]/g, '_')
        .toLowerCase();
      var value = compact(props[key]);
      if (value !== null && value !== undefined && value !== '') out[normalizedKey] = value;
    });
    return out;
  }

  var eventMap = {
    start: 'diagnosis_started',
    type_classified: 'diagnosis_completed',
    line_clicked: 'line_save_clicked',
    line_login_started: 'line_login_started',
    conditions_link_clicked: 'conditions_link_clicked',
    conditions_complete: 'conditions_completed',
    final_complete: 'detailed_diagnosis_completed',
    opt_submitted: 'optional_answers_submitted',
    share_clicked: 'result_shared',
    replay_restart: 'diagnosis_restarted'
  };

  var passthrough = {
    diagnosis_cta_clicked: true,
    page_viewed: true
  };

  function track(name, props) {
    var eventName = eventMap[name] || (passthrough[name] ? name : null);
    if (!eventName || !window.mixpanel || typeof window.mixpanel.track !== 'function') return;
    try { window.mixpanel.track(eventName, normalizeProperties(props)); }
    catch (e) {}
  }

  window.FrejunoAnalytics = {
    track: track,
    registerContext: function(props) {
      if (!window.mixpanel || typeof window.mixpanel.register !== 'function') return;
      try { window.mixpanel.register(normalizeProperties(props)); }
      catch (e) {}
    }
  };

  window.mixpanel.init(MIXPANEL_TOKEN, {
    debug: /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname),
    persistence: 'localStorage',
    track_pageview: false
  });
  window.FrejunoAnalytics.registerContext(baseProps());
  track('page_viewed');

  document.addEventListener('click', function(event) {
    var link = event.target && event.target.closest ? event.target.closest('a') : null;
    if (!link) return;
    var href = link.getAttribute('href') || '';
    if (href.indexOf('mvp_type_diagnosis_v3.html') >= 0) {
      var source = 'unknown';
      try { source = new URL(link.href, window.location.href).searchParams.get('src') || source; }
      catch (e) {}
      track('diagnosis_cta_clicked', { cta_source: source, cta_text: link.textContent.trim() });
    } else if (href.indexOf('/diagnosis/conditions') >= 0 || href.indexOf('conditions.html') >= 0) {
      track('conditions_link_clicked', { cta_text: link.textContent.trim(), from: pageName() });
    } else if (href.indexOf('line.me/') >= 0) {
      track('line_clicked', { from: pageName(), method: 'line_link' });
    }
  }, true);
})();
