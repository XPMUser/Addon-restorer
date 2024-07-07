var capturedTabObj = {};
class bgMethods {
    static sendRuntime(data) {
        chrome.runtime.sendMessage(data);
    }
    static getPopup() {
        return chrome.extension.getViews({
            type: 'popup'
        })[0]
    }
    static sendAnalyserStream() {
        const analyserAudioCtx = capturedTabObj.audioCtx;
        const destination = capturedTabObj.audioCtx.createMediaStreamDestination();
        capturedTabObj.analyserGain.connect(destination);
        bgMethods.getPopup().analyserModule({
            stream: destination.stream,
            ctx: analyserAudioCtx
        });
    }
    static sendCaptureInterval() {
        setInterval(() => {
            Methods.sendRuntime({
                type: 'Capturing Audio'
            });
        }, 2000);
    }
    static onTabRemoveListener() {
        const onTabRemoved = () => {
            Methods.setIcon('off');
            Methods.save('power', 'false');
            bgMethods.closeAudio();
            location.reload();
        }
        chrome.tabs.onRemoved.addListener(
            (id) => {
                id == capturedTabObj.id && onTabRemoved();
            }
        );
    }
    static sendSettings(module) {
        let key = {};
        const volume = () => {
            key = {
                type: 'volumeSetting',
                value: capturedTabObj.volumeGainNode.gain.value
            }
        }
        const eq = () => {
            key = {
                type: 'eqSettings',
                twenty: capturedTabObj.twenty.gain.value ,
                fifty: capturedTabObj.fifty.gain.value ,
                oneHundred: capturedTabObj.oneHundred.gain.value ,
                twoHundred: capturedTabObj.twoHundred.gain.value ,
                fiveHundred: capturedTabObj.fiveHundred.gain.value ,
                oneThousand: capturedTabObj.oneThousand.gain.value ,
                twoThousand: capturedTabObj.twoThousand.gain.value ,
                fiveThousand: capturedTabObj.fiveThousand.gain.value ,
                tenThousand: capturedTabObj.tenThousand.gain.value ,
                twentyThousand: capturedTabObj.twentyThousand.gain.value 
                // twenty: capturedTabObj.twenty.gain.value * 2,
                // fifty: capturedTabObj.fifty.gain.value * 2,
                // oneHundred: capturedTabObj.oneHundred.gain.value * 2,
                // twoHundred: capturedTabObj.twoHundred.gain.value * 2,
                // fiveHundred: capturedTabObj.fiveHundred.gain.value * 2,
                // oneThousand: capturedTabObj.oneThousand.gain.value * 2,
                // twoThousand: capturedTabObj.twoThousand.gain.value * 2,
                // fiveThousand: capturedTabObj.fiveThousand.gain.value * 2,
                // tenThousand: capturedTabObj.tenThousand.gain.value * 2,
                // twentyThousand: capturedTabObj.twentyThousand.gain.value * 2
            }
        }
        const convolver = () => {
            key = {
                type: 'convolverSettings',
                highCut: capturedTabObj.convolver.highCut,
                lowCut: capturedTabObj.convolver.lowCut,
                dryLevel: capturedTabObj.convolver.dryLevel,
                wetLevel: capturedTabObj.convolver.wetLevel
            }
        }
        const limiter = () => {
            key = {
                type: 'limiterSettings',
                threshold: capturedTabObj.compressor.threshold.value,
                attack: capturedTabObj.compressor.attack.value,
                release: capturedTabObj.compressor.release.value,
                ratio: capturedTabObj.compressor.ratio.value,
                knee: capturedTabObj.compressor.knee.value
            }
        }
        const pitch = () => {
            key = {
                type: 'pitchSettings',
                pitch: capturedTabObj.pitch.value,
                cents: capturedTabObj.pitch.cents
            }
        }
        const chorus = () => {
            key = {
                type: 'chorusSettings',
                rate: capturedTabObj.chorus.rate,
                depth: capturedTabObj.chorus.depth,
                feedback: capturedTabObj.chorus.feedback,
                delay: capturedTabObj.chorusFixedDelay || 1.5
            };
        }
        const handleModule = {
            'limiter': limiter,
            'eq': eq,
            'chorus': chorus,
            'convolver': convolver,
            'volume': volume,
            'pitch': pitch
        }
        handleModule[module]();
        Methods.sendRuntime(key);
    }
    static sendVolumeSetting() {
        bgMethods.sendSettings('volume');
    }
    static sendLimiterSettings() {
        bgMethods.sendSettings('limiter');
    }
    static sendChorusSettings() {
        Methods.returnState('chorusBypass') != 'true' && bgMethods.sendSettings('chorus');
    }
    static sendConvolverSettings() {
        Methods.returnState('convolverBypass') != 'true' && bgMethods.sendSettings('convolver');
    }
    static sendPitchSettings() {
        Methods.returnState('pitchBypass') != 'true' && bgMethods.sendSettings('pitch');
    }
    static sendEqSettings() {
        bgMethods.sendSettings('eq');
    }
    static checkStream() {
        return capturedTabObj.stream ? true : false;
    }
    static closeAudio() {
        const close = () => {
            capturedTabObj.stream.getAudioTracks()[0].stop();
            capturedTabObj.audioCtx.close();
            capturedTabObj = {};
        }
        bgMethods.checkStream() && close();
    }
    static createAudio(stream) {
        const setAudioDefaults = () => {
            capturedTabObj.audioCtx.latencyHint = 'playback';
            capturedTabObj.twenty.type = 'lowshelf';
            capturedTabObj.twenty.frequency.setValueAtTime(32, capturedTabObj.audioCtx.currentTime);
            capturedTabObj.fifty.type = 'peaking';
            capturedTabObj.fifty.frequency.setValueAtTime(64, capturedTabObj.audioCtx.currentTime);
            capturedTabObj.fifty.Q.setValueAtTime(5, capturedTabObj.audioCtx.currentTime);
            capturedTabObj.oneHundred.type = 'peaking';
            capturedTabObj.oneHundred.frequency.setValueAtTime(125, capturedTabObj.audioCtx.currentTime);
            capturedTabObj.oneHundred.Q.setValueAtTime(5, capturedTabObj.audioCtx.currentTime);
            capturedTabObj.twoHundred.type = 'peaking';
            capturedTabObj.twoHundred.frequency.setValueAtTime(250, capturedTabObj.audioCtx.currentTime);
            capturedTabObj.twoHundred.Q.setValueAtTime(5, capturedTabObj.audioCtx.currentTime);
            capturedTabObj.fiveHundred.type = 'peaking';
            capturedTabObj.fiveHundred.frequency.setValueAtTime(500, capturedTabObj.audioCtx.currentTime);
            capturedTabObj.fiveHundred.Q.setValueAtTime(5, capturedTabObj.audioCtx.currentTime);
            capturedTabObj.oneThousand.type = 'peaking';
            capturedTabObj.oneThousand.frequency.setValueAtTime(1000, capturedTabObj.audioCtx.currentTime);
            capturedTabObj.oneThousand.Q.setValueAtTime(5, capturedTabObj.audioCtx.currentTime);
            capturedTabObj.twoThousand.type = 'peaking';
            capturedTabObj.twoThousand.frequency.setValueAtTime(2000, capturedTabObj.audioCtx.currentTime);
            capturedTabObj.twoThousand.Q.setValueAtTime(5, capturedTabObj.audioCtx.currentTime);
            capturedTabObj.fiveThousand.type = 'peaking';
            capturedTabObj.fiveThousand.frequency.setValueAtTime(4000, capturedTabObj.audioCtx.currentTime);
            capturedTabObj.fiveThousand.Q.setValueAtTime(5, capturedTabObj.audioCtx.currentTime);
            capturedTabObj.tenThousand.type = 'peaking';
            capturedTabObj.tenThousand.frequency.setValueAtTime(8000, capturedTabObj.audioCtx.currentTime);
            capturedTabObj.tenThousand.Q.setValueAtTime(5, capturedTabObj.audioCtx.currentTime);
            capturedTabObj.twentyThousand.type = 'highshelf';
            capturedTabObj.twentyThousand.frequency.setValueAtTime(16000, capturedTabObj.audioCtx.currentTime);
            capturedTabObj.compressor.threshold.value = 0;
            capturedTabObj.compressor.attack.value = 0;
            capturedTabObj.compressor.release.value = 0.2;
            capturedTabObj.compressor.ratio.value = 4;
            capturedTabObj.compressor.knee.value = 10;
            capturedTabObj.volumeGainNode.gain.setValueAtTime(1, capturedTabObj.audioCtx.currentTime);
            capturedTabObj.rightKaraokeGain.gain.setValueAtTime(0.5, capturedTabObj.audioCtx.currentTime);
            capturedTabObj.leftKaraokeGain.gain.setValueAtTime(-0.5, capturedTabObj.audioCtx.currentTime);
            capturedTabObj.leftKaraokeHPF.type = "highpass";
            capturedTabObj.leftKaraokeHPF.frequency.setValueAtTime(80, capturedTabObj.audioCtx.currentTime);
            capturedTabObj.monoGain.gain.setValueAtTime(0.5, capturedTabObj.audioCtx.currentTime);
            capturedTabObj.analyserGain.gain.setValueAtTime(1, capturedTabObj.audioCtx.currentTime);
            const pitchValues = () => {
                capturedTabObj.pitch.value = 0;
                capturedTabObj.pitch.cents = 0;
                capturedTabObj.pitch.setPitchOffset(0);
            }
            const chorusValues = () => {
                capturedTabObj.chorus.depth = 0.8;
                capturedTabObj.chorus.rate = 0.7;
                capturedTabObj.chorus.feedback = 0.9;
                capturedTabObj.chorus.delay = 1.5;
                capturedTabObj.chorusFixedDelay = 1.5;
                capturedTabObj.chorus.bypass = 0;
            }
            const convolverValues = () => {
                capturedTabObj.convolver.wetLevel = 0;
                capturedTabObj.convolver.dryLevel = 1;
                capturedTabObj.convolver.lowCut = 20;
                capturedTabObj.convolver.highCut = 22050;
                capturedTabObj.convolver.bypass = 0;
            }
            Methods.returnState('pitchBypass') != 'true' && pitchValues();
            Methods.returnState('chorusBypass') != 'true' && chorusValues();
            Methods.returnState('convolverBypass') != 'true' && convolverValues();
        }
        const createNodes = () => {
            capturedTabObj.stream = stream;
            capturedTabObj.audioCtx = new AudioContext();
            var tuna = new Tuna(capturedTabObj.audioCtx);
            Methods.returnState('chorusBypass') != 'true' && (capturedTabObj.chorus = new tuna.Chorus);
            Methods.returnState('convolverBypass') != 'true' && (capturedTabObj.convolver = new tuna.Convolver);
            Methods.returnState('pitchBypass') != 'true' && (capturedTabObj.pitch = new Jungle(capturedTabObj.audioCtx));
            capturedTabObj.streamOutput = capturedTabObj.audioCtx.createMediaStreamSource(capturedTabObj.stream);
            capturedTabObj.analyserGain = capturedTabObj.audioCtx.createGain();
            capturedTabObj.panSplitter = capturedTabObj.audioCtx.createChannelSplitter(2);
            capturedTabObj.leftPanGain = capturedTabObj.audioCtx.createGain();
            capturedTabObj.rightPanGain = capturedTabObj.audioCtx.createGain();
            capturedTabObj.panMerger = capturedTabObj.audioCtx.createChannelMerger(2);
            capturedTabObj.monoSplitter = capturedTabObj.audioCtx.createChannelSplitter(2);
            capturedTabObj.monoGain = capturedTabObj.audioCtx.createGain();
            capturedTabObj.monoMerger = capturedTabObj.audioCtx.createChannelMerger(2);
            capturedTabObj.volumeGainNode = capturedTabObj.audioCtx.createGain();
            capturedTabObj.leftKaraokeGain = capturedTabObj.audioCtx.createGain();
            capturedTabObj.leftKaraokeHPF = capturedTabObj.audioCtx.createBiquadFilter();
            capturedTabObj.rightKaraokeGain = capturedTabObj.audioCtx.createGain();
            capturedTabObj.karaokeMerger = capturedTabObj.audioCtx.createChannelMerger(2);
            capturedTabObj.karaokeSplitter = capturedTabObj.audioCtx.createChannelSplitter(2);
            capturedTabObj.compressor = capturedTabObj.audioCtx.createDynamicsCompressor();
            capturedTabObj.twenty = capturedTabObj.audioCtx.createBiquadFilter();
            capturedTabObj.fifty = capturedTabObj.audioCtx.createBiquadFilter();
            capturedTabObj.oneHundred = capturedTabObj.audioCtx.createBiquadFilter();
            capturedTabObj.twoHundred = capturedTabObj.audioCtx.createBiquadFilter();
            capturedTabObj.fiveHundred = capturedTabObj.audioCtx.createBiquadFilter();
            capturedTabObj.oneThousand = capturedTabObj.audioCtx.createBiquadFilter();
            capturedTabObj.twoThousand = capturedTabObj.audioCtx.createBiquadFilter();
            capturedTabObj.fiveThousand = capturedTabObj.audioCtx.createBiquadFilter();
            capturedTabObj.tenThousand = capturedTabObj.audioCtx.createBiquadFilter();
            capturedTabObj.twentyThousand = capturedTabObj.audioCtx.createBiquadFilter();
        }
        createNodes();
        setAudioDefaults();
        this.sendCaptureInterval();
    }
    static toggleMonoNodes(mono) {
        capturedTabObj.panMerger.context.__connectified__ == true && capturedTabObj.panMerger.disconnect();
        capturedTabObj.monoSplitter.context.__connectified__ == true && capturedTabObj.monoSplitter.disconnect();
        capturedTabObj.monoGain.context.__connectified__ == true && capturedTabObj.monoGain.disconnect();
        const connectMono = () => {
            capturedTabObj.panMerger.connect(capturedTabObj.monoGain);
            capturedTabObj.monoGain.connect(capturedTabObj.monoSplitter);
            capturedTabObj.monoSplitter.connect(capturedTabObj.monoMerger, 0, 1);
            capturedTabObj.monoSplitter.connect(capturedTabObj.monoMerger, 0, 0);
            capturedTabObj.monoSplitter.connect(capturedTabObj.monoMerger, 1, 0);
            capturedTabObj.monoSplitter.connect(capturedTabObj.monoMerger, 1, 1);
        };
        const connectStereo = () => {
            capturedTabObj.panMerger.connect(capturedTabObj.monoSplitter);
            capturedTabObj.monoSplitter.connect(capturedTabObj.monoMerger, 0, 0);
            capturedTabObj.monoSplitter.connect(capturedTabObj.monoMerger, 1, 1);
        };
        mono == true ? connectMono() : connectStereo();
    }
    static connect() {
        capturedTabObj.streamOutput.connect(capturedTabObj.panSplitter);
        capturedTabObj.panSplitter.connect(capturedTabObj.leftPanGain, 0);
        capturedTabObj.panSplitter.connect(capturedTabObj.rightPanGain, 1);
        capturedTabObj.leftPanGain.connect(capturedTabObj.panMerger, 0, 0);
        capturedTabObj.rightPanGain.connect(capturedTabObj.panMerger, 0, 1);
        Methods.load('mono') == 'true' ? this.toggleMonoNodes('true') : this.toggleMonoNodes('false');
        if (Methods.returnState('pitchBypass') != 'true' && Methods.returnState('chorusBypass') != 'true' && Methods.returnState('convolverBypass') != 'true') {
            capturedTabObj.monoMerger.connect(capturedTabObj.pitch);
            capturedTabObj.pitch.output.connect(capturedTabObj.chorus);
            capturedTabObj.chorus.connect(capturedTabObj.convolver);
            capturedTabObj.convolver.connect(capturedTabObj.twenty)
        } else if (Methods.returnState('pitchBypass') == 'true' && Methods.returnState('chorusBypass') != 'true' && Methods.returnState('convolverBypass') != 'true') {
            capturedTabObj.monoMerger.connect(capturedTabObj.chorus);
            capturedTabObj.chorus.connect(capturedTabObj.convolver);
            capturedTabObj.convolver.connect(capturedTabObj.twenty)
        } else if (Methods.returnState('pitchBypass') != 'true' && Methods.returnState('chorusBypass') && Methods.returnState('convolverBypass') != 'true') {
            capturedTabObj.monoMerger.connect(capturedTabObj.pitch);
            capturedTabObj.pitch.output.connect(capturedTabObj.convolver);
            capturedTabObj.convolver.connect(capturedTabObj.twenty)
        } else if (Methods.returnState('pitchBypass') != 'true' && Methods.returnState('chorusBypass') != 'true' && Methods.returnState('convolverBypass') == 'true') {
            capturedTabObj.monoMerger.connect(capturedTabObj.pitch);
            capturedTabObj.pitch.output.connect(capturedTabObj.chorus);
            capturedTabObj.chorus.connect(capturedTabObj.twenty);
        } else if (Methods.returnState('pitchBypass') != 'true' && Methods.returnState('chorusBypass') == 'true' && Methods.returnState('convolverBypass') == 'true') {
            capturedTabObj.monoMerger.connect(capturedTabObj.pitch);
            capturedTabObj.pitch.output.connect(capturedTabObj.twenty);
        } else if (Methods.returnState('pitchBypass') == 'true' && Methods.returnState('chorusBypass') == 'true' && Methods.returnState('convolverBypass') != 'true') {
            capturedTabObj.monoMerger.connect(capturedTabObj.convolver);
            capturedTabObj.convolver.connect(capturedTabObj.twenty);
        } else if (Methods.returnState('pitchBypass') == 'true' && Methods.returnState('chorusBypass') != 'true' && Methods.returnState('convolverBypass') == 'true') {
            capturedTabObj.monoMerger.connect(capturedTabObj.chorus);
            capturedTabObj.chorus.connect(capturedTabObj.twenty);
        } else if (Methods.returnState('pitchBypass') == 'true' && Methods.returnState('chorusBypass') == 'true' && Methods.returnState('convolverBypass') == 'true') {
            capturedTabObj.monoMerger.connect(capturedTabObj.twenty);
        }
        capturedTabObj.twenty.connect(capturedTabObj.fifty);
        capturedTabObj.fifty.connect(capturedTabObj.oneHundred);
        capturedTabObj.oneHundred.connect(capturedTabObj.twoHundred);
        capturedTabObj.twoHundred.connect(capturedTabObj.fiveHundred);
        capturedTabObj.fiveHundred.connect(capturedTabObj.oneThousand);
        capturedTabObj.oneThousand.connect(capturedTabObj.twoThousand);
        capturedTabObj.twoThousand.connect(capturedTabObj.fiveThousand);
        capturedTabObj.fiveThousand.connect(capturedTabObj.tenThousand);
        capturedTabObj.tenThousand.connect(capturedTabObj.twentyThousand);
        capturedTabObj.twentyThousand.connect(capturedTabObj.compressor);
        capturedTabObj.compressor.connect(capturedTabObj.volumeGainNode);
        Methods.load('karaoke') == 'true' ? this.toggleKaraoke('true') : this.toggleKaraoke('false');
    }
    static toggleKaraoke(karaoke) {
        const karaokeOff = () => {
            capturedTabObj.volumeGainNode.disconnect();
            capturedTabObj.volumeGainNode.connect(capturedTabObj.analyserGain);
            capturedTabObj.analyserGain.connect(capturedTabObj.audioCtx.destination);
        };
        const karaokeOn = () => {
            capturedTabObj.volumeGainNode.disconnect();
            capturedTabObj.volumeGainNode.connect(capturedTabObj.karaokeSplitter);
            capturedTabObj.karaokeSplitter.connect(capturedTabObj.leftKaraokeGain, 0);
            capturedTabObj.karaokeSplitter.connect(capturedTabObj.rightKaraokeGain, 1);
            capturedTabObj.leftKaraokeGain.connect(capturedTabObj.leftKaraokeHPF);
            capturedTabObj.leftKaraokeHPF.connect(capturedTabObj.karaokeMerger, 0, 0);
            capturedTabObj.leftKaraokeGain.connect(capturedTabObj.karaokeMerger, 0, 1);
            capturedTabObj.rightKaraokeGain.connect(capturedTabObj.karaokeMerger, 0, 1);
            capturedTabObj.rightKaraokeGain.connect(capturedTabObj.karaokeMerger, 0, 0);
            capturedTabObj.karaokeMerger.connect(capturedTabObj.analyserGain);
            capturedTabObj.analyserGain.connect(capturedTabObj.audioCtx.destination);
        };
        karaoke == true ? karaokeOn() : karaokeOff();
    }
    static initOn(title) {
        bgMethods.sendVolumeSetting();
        bgMethods.sendEqSettings();
        bgMethods.sendLimiterSettings();
        bgMethods.sendChorusSettings();
        bgMethods.sendConvolverSettings();
        bgMethods.sendPitchSettings();
        bgMethods.sendAnalyserStream();
        bgMethods.sendRuntime({
            type: 'popupVisualOn',
            value: title
        });
    }
    static powerIcon(id, title) {
        capturedTabObj.stream.getAudioTracks()[0].stop();
        chrome.tabCapture.capture({
                audio: true,
                video: false
            },
            (strm) => {
                capturedTabObj.stream = strm;
                capturedTabObj.streamOutput = capturedTabObj.audioCtx.createMediaStreamSource(capturedTabObj.stream);
                capturedTabObj.streamOutput.connect(capturedTabObj.panSplitter);
                capturedTabObj.title = title;
                capturedTabObj.id = id;
                bgMethods.onTabRemoveListener(id);
                bgMethods.sendAnalyserStream();
                bgMethods.initOn(title);
            }
        );
    }
    static powerOn(id, title) {
        chrome.tabCapture.capture({
                audio: true,
                video: false
            },
            (stream) => {
                if (null == stream) {
                    bgMethods.sendRuntime({
                        type: 'popupPowerOff'
                    });
                } else {
                    capturedTabObj.id = id;
                    capturedTabObj.title = title;
                    bgMethods.createAudio(stream);
                    bgMethods.pan(Methods.load('pan'));
                    bgMethods.connect();
                    if (Methods.returnState('autoLoadPreset') == 'true') {
                        Methods.returnState('limiterPreset') == 'true' ?
                            bgMethods.getPopup().Preset.loadPreset('limiterPreset') :
                            bgMethods.sendLimiterSettings();
                        Methods.returnState('eqPreset') == 'true' ?
                            bgMethods.getPopup().Preset.loadPreset('eqPreset') :
                            bgMethods.sendEqSettings();
                        Methods.returnState('chorusPreset') == 'true' ?
                            bgMethods.getPopup().Preset.loadPreset('chorusPreset') :
                            bgMethods.sendChorusSettings();
                        Methods.returnState('convolverPreset') == 'true' ?
                            bgMethods.getPopup().Preset.loadPreset('convolverPreset') :
                            bgMethods.sendConvolverSettings();
                        Methods.returnState('pitchPreset') == 'true' ?
                            bgMethods.getPopup().Preset.loadPreset('pitchPreset') :
                            bgMethods.sendPitchSettings();
                    } else {
                        bgMethods.sendVolumeSetting();
                        bgMethods.sendEqSettings();
                        bgMethods.sendLimiterSettings();
                        bgMethods.sendChorusSettings();
                        bgMethods.sendConvolverSettings();
                        bgMethods.sendPitchSettings();
                    }
                }
                bgMethods.onTabRemoveListener(id);
                bgMethods.sendAnalyserStream();
                bgMethods.sendRuntime({
                    type: 'popupVisualOn',
                    value: title
                });
            }
        )
    }
    static fullScreen(CaptureInfo) {
        if ('active' == CaptureInfo.status) {
            if (CaptureInfo.tabId == capturedTabObj.id) {
                chrome.windows.getCurrent(
                    (window) => {
                        const winId = window.id;
                        if ('false' != Methods.load('fullScreen')) {
                            if (true == CaptureInfo.fullscreen) {
                                Methods.save('windowState', window.state);
                                chrome.windows.update(winId, {
                                    state: 'fullscreen'
                                }, null);
                            } else {
                                chrome.windows.update(winId, {
                                    state: Methods.load('windowState')
                                }, null);
                            }
                        } else {
                            chrome.windows.update(winId, {
                                state: window.state
                            }, null);
                        }
                    }
                );
            }
        }
    }
    static pan(val) {
        val = Number(val);
        const minus = () => {
            capturedTabObj.leftPanGain.gain.setValueAtTime(1, capturedTabObj.audioCtx.currentTime);
            capturedTabObj.rightPanGain.gain.setValueAtTime(1 + val, capturedTabObj.audioCtx.currentTime);
        }
        const plus = () => {
            capturedTabObj.leftPanGain.gain.setValueAtTime(1 - val, capturedTabObj.audioCtx.currentTime);
            capturedTabObj.rightPanGain.gain.setValueAtTime(1, capturedTabObj.audioCtx.currentTime);
        }
        val > 0 ? plus() : minus();
    }
}
class Background {
    static initListener() {
        chrome.runtime.onMessage.addListener(
            (message) => {
                const type = message.type;
                let val = message.value;
                if (type == 'twenty' || type == 'fifty' || type == 'oneHundred' || type == 'twoHundred' || type == 'fiveHundred' || type == 'oneThousand' || type == 'twoThousand' || type == 'fiveThousand' || type == 'tenThousand' || type == 'twentyThousand') {
                    if (Number(val) == -20) {
                        val = -40;
                    }
                }
                switch (type) {
                    case 'threshold':
                        capturedTabObj.compressor.threshold.setValueAtTime(val, capturedTabObj.audioCtx.currentTime);
                        break;
                    case 'attack':
                        capturedTabObj.compressor.attack.setValueAtTime(val, capturedTabObj.audioCtx.currentTime);
                        break;
                    case 'release':
                        capturedTabObj.compressor.release.setValueAtTime(val, capturedTabObj.audioCtx.currentTime);
                        break;
                    case 'knee':
                        capturedTabObj.compressor.knee.setValueAtTime(val, capturedTabObj.audioCtx.currentTime);
                        break;
                    case 'ratio':
                        capturedTabObj.compressor.ratio.setValueAtTime(val, capturedTabObj.audioCtx.currentTime);
                        break;
                    case 'volume':
                        capturedTabObj.volumeGainNode.gain.setValueAtTime(val, capturedTabObj.audioCtx.currentTime);
                        break;
                    case 'twenty':
                        capturedTabObj.twenty.gain.setValueAtTime(val, capturedTabObj.audioCtx.currentTime);
                        break;
                    case 'fifty':
                        capturedTabObj.fifty.gain.setValueAtTime(val, capturedTabObj.audioCtx.currentTime);
                        break;
                    case 'oneHundred':
                        capturedTabObj.oneHundred.gain.setValueAtTime(val, capturedTabObj.audioCtx.currentTime);
                        break;
                    case 'twoHundred':
                        capturedTabObj.twoHundred.gain.setValueAtTime(val, capturedTabObj.audioCtx.currentTime);
                        break;
                    case 'fiveHundred':
                        capturedTabObj.fiveHundred.gain.setValueAtTime(val, capturedTabObj.audioCtx.currentTime);
                        break;
                    case 'oneThousand':
                        capturedTabObj.oneThousand.gain.setValueAtTime(val, capturedTabObj.audioCtx.currentTime);
                        break;
                    case 'twoThousand':
                        capturedTabObj.twoThousand.gain.setValueAtTime(val, capturedTabObj.audioCtx.currentTime);
                        break;
                    case 'fiveThousand':
                        capturedTabObj.fiveThousand.gain.setValueAtTime(val, capturedTabObj.audioCtx.currentTime);
                        break;
                    case 'tenThousand':
                        capturedTabObj.tenThousand.gain.setValueAtTime(val, capturedTabObj.audioCtx.currentTime);
                        break;
                    case 'twentyThousand':
                        capturedTabObj.twentyThousand.gain.setValueAtTime(val, capturedTabObj.audioCtx.currentTime);
                        break;
                    case 'sendAnalyserStream':
                        bgMethods.sendAnalyserStream();
                        break;
                    case 'bgPowerIcon':
                        bgMethods.powerIcon(val.tabId, val.tabTitle);
                        break;
                    case 'bgPowerOn':
                        bgMethods.powerOn(val.tabId, val.tabTitle);
                        break;
                    case 'bgInitOn':
                        bgMethods.initOn(message.title);
                        break;
                    case 'closeAudio':
                        bgMethods.closeAudio();
                        location.reload();
                        break;
                    case 'checkStream':
                        bgMethods.checkStream();
                        break;
                    case 'mono':
                        bgMethods.toggleMonoNodes(val);
                        break;
                    case 'karaoke':
                        bgMethods.toggleKaraoke(val);
                        break;
                    case 'sendSettingsToPopup':
                        bgMethods.sendVolumeSetting();
                        bgMethods.sendEqSettings();
                        bgMethods.sendLimiterSettings();
                        bgMethods.sendPitchSettings();
                        bgMethods.sendChorusSettings();
                        bgMethods.sendConvolverSettings();
                        bgMethods.sendRuntime('popupVisualOn');
                        break;
                    case 'pan':
                        bgMethods.pan(val);
                        break;
                }
                if (Methods.returnState('pitchBypass') != 'true' && type == 'pitch') {
                    capturedTabObj.pitch.value = val;
                    capturedTabObj.pitch.setPitchOffset(Number(val) + Number(capturedTabObj.pitch.cents / 100 || 0));
                }
                if (Methods.returnState('pitchBypass') != 'true' && type == 'pitchCents') {
                    capturedTabObj.pitch.cents = message.value;
                    capturedTabObj.pitch.setPitchOffset(Number(capturedTabObj.pitch.value) + Number(message.value / 100));
                }
                if (Methods.returnState('convolverBypass') != 'true') {
                    if (type == 'convolverHighCut') {
                        capturedTabObj.convolver.highCut = val
                    }
                    if (type == 'convolverLowCut') {
                        capturedTabObj.convolver.lowCut = val
                    }
                    if (type == 'convolverDryLevel') {
                        capturedTabObj.convolver.dryLevel = val
                    }
                    if (type == 'convolverWetLevel') {
                        capturedTabObj.convolver.wetLevel = val
                    }
                }
                if (Methods.returnState('chorusBypass') != 'true') {
                    const setDelay = () => {
                        capturedTabObj.chorus.delay = message.value;
                        capturedTabObj.chorusFixedDelay = message.value
                    }
                    type == 'chorusRate' && (capturedTabObj.chorus.rate = message.value);
                    type == 'chorusDepth' && (capturedTabObj.chorus.depth = message.value);
                    type == 'chorusFeedback' && (capturedTabObj.chorus.feedback = message.value);
                    type == 'chorusDelay' && setDelay();
                }
            }
        );
        chrome.tabCapture.onStatusChanged.addListener(bgMethods.fullScreen)
    }
    static emptyTabObj() {
        capturedTabObj = {};
    }
    static clearStorage() {
        Methods.save('instance', 'false');
        Methods.save('power', 'false');
    }
    static install() {
        function initStorage() {
            Methods.save('mono', 'false');
            Methods.save('karaoke', 'false');
            Methods.save('convolverBypass', 'true')
            Methods.save('pitchBypass', 'true')
            Methods.save('chorusBypass', 'true')
            Methods.save('currentTab', 'limiter');
            Methods.save('autoOpen', 'false');
            Methods.save('info', 'true')
            Methods.save('volumePreset', 'true')
            Methods.save('lightTheme', 'false');
            Methods.save('autoLoadPreset', 'true')
            Methods.save('fullScreen', 'true');
            Methods.save('pan', '0');
        }
        chrome.runtime.onInstalled.addListener(function (details) {
            details.reason == 'install' && initStorage();
        });
    }
    constructor() {
        Methods.setIcon('off');
        Background.install();
        Background.clearStorage();
        Background.initListener();
        window.onbeforeunload = Background.emptyTabObj();
    }
}
var bg = new Background();