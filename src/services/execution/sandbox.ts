export const WORKER_TEMPLATE = `
// Strip dangerous globals
self.fetch = undefined;
self.XMLHttpRequest = undefined;
self.importScripts = undefined;
self.WebSocket = undefined;
self.indexedDB = undefined;

self.addEventListener('message', function(message) {
  if (message.data.type === 'execute') {
    var code = message.data.code;
    var testCases = message.data.testCases;
    var results = [];

    // Create the user function from code
    var userFn;
    try {
      userFn = new Function('return (' + code + ')')();
    } catch (e) {
      // If wrapping as expression fails, try executing as statements
      // and look for an exported/returned function
      try {
        var module = { exports: {} };
        var exports = module.exports;
        new Function('module', 'exports', code)(module, exports);
        userFn = module.exports.default || module.exports;
      } catch (e2) {
        self.postMessage({
          type: 'result',
          testResults: testCases.map(function(tc) {
            return {
              testCaseId: tc.id,
              passed: false,
              actualOutput: undefined,
              error: e2.toString()
            };
          })
        });
        return;
      }
    }

    // Run each test case independently
    for (var i = 0; i < testCases.length; i++) {
      var tc = testCases[i];
      try {
        var actual = typeof userFn === 'function'
          ? userFn.apply(null, tc.input)
          : userFn;
        var passed = JSON.stringify(actual) === JSON.stringify(tc.expectedOutput);
        results.push({
          testCaseId: tc.id,
          passed: passed,
          actualOutput: actual,
          error: null
        });
      } catch (e) {
        results.push({
          testCaseId: tc.id,
          passed: false,
          actualOutput: undefined,
          error: e.toString()
        });
      }
    }

    self.postMessage({ type: 'result', testResults: results });
  }
});
`

export function createSandboxWorkerBlob(): string {
  const blob = new Blob([WORKER_TEMPLATE], { type: 'application/javascript' })
  return URL.createObjectURL(blob)
}
