// "content_security_policy": "script-src 'self' https://m.stock.pingan.com;frame-src https://m.stock.pingan.com; object-src 'self'"
chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('main.html', {
        'id': 'main',
        'bounds': {
            'width': 542,
            'height': 360
        },
        'resizable': true,
        'frame': 'none'
    });
});