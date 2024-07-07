var presetOn = $('#presetOn');
var presetOff = $('#presetOff');
var volumePresetOn = $('#volumePresetOn');
var volumePresetOff = $('#volumePresetOff');
var fullScreenOn = $('#fullScreenOn');
var fullScreenOff = $('#fullScreenOff');
var openOn = $('#openOn');
var openOff = $('#openOff');
var infoFld = $('#info');
openOn.on('click', () => {
    Methods.save('autoOpen', 'false');
});
openOff.on('click', () => {
    Methods.save('autoOpen', 'true');
});
fullScreenOff.on('click', () => {
    Methods.save('fullScreen', 'false');
});
fullScreenOn.on('click', () => {
    Methods.save('fullScreen', 'true');
});
presetOff.on('click', () => {
    Methods.save('autoLoadPreset', 'false');
    Methods.save('volumePresetVal', 1);
});
presetOn.on('click', () => {
    Methods.save('autoLoadPreset', 'true');
})
volumePresetOff.on('click', () => {
    Methods.save('volumePreset', 'false');
    Methods.save('volumePresetVal', 1);
});
volumePresetOn.on('click', () => {
    Methods.save('volumePreset', 'true');
});
infoFld.on('click', () => {
    if (Methods.load('info') != 'true') {
        Methods.save('info', 'true');
    } else {
        Methods.save('info', 'false');
    }
});
Methods.load('info') != "true" ? infoFld[0].checked = false : infoFld[0].checked = true;
Methods.load('autoOpen') != "true" ? openOn.click() : openOff.click();
Methods.load('autoLoadPreset') != "true" ? presetOff.click() : presetOn.click();
Methods.load('volumePreset') != "true" ? volumePresetOff.click() : volumePresetOn.click();
Methods.load('fullScreen') != "true" ? fullScreenOff.click() : fullScreenOn.click();
$('#infoIconLabel').html(chrome.i18n.getMessage('infoIconLabel'));
$('#openOnClick').html(chrome.i18n.getMessage('openOnClick'));
$('#loadPresetOnStartup').html(chrome.i18n.getMessage('loadPresetOnStartup'));
$('#fullScreenMode').html(chrome.i18n.getMessage('fullScreenMode'));
$('#saveVolumeWithPreset').html(chrome.i18n.getMessage('saveVolumeWithPreset'));
$('.on').html(chrome.i18n.getMessage('on'));
$('.off').html(chrome.i18n.getMessage('off'));