import React, { useState, useRef } from 'react';
import {
  Music,
  Play,
  Square,
  Volume2,
  Download,
  Flame,
  CheckCircle2,
  Radio,
  Sliders,
  Cpu,
} from 'lucide-react';
import { BuildJob } from '../types';

interface AudioWorkshopViewProps {
  onStartJob: (
    title: string,
    category: BuildJob['category'],
    input: string,
    outputFormat: string,
    targetPlatform: string,
    payload?: any
  ) => void;
  isLoading: boolean;
  lang: 'ar' | 'en';
}

export const AudioWorkshopView: React.FC<AudioWorkshopViewProps> = ({
  onStartJob,
  isLoading,
  lang,
}) => {
  const [frequency, setFrequency] = useState<number>(440);
  const [duration, setDuration] = useState<number>(3);
  const [waveType, setWaveType] = useState<OscillatorType>('sine');
  const [isPlayingClient, setIsPlayingClient] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  // Client-side quick acoustic preview via Web Audio API
  const handleClientPlay = () => {
    if (isPlayingClient) {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
      }
      setIsPlayingClient(false);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = waveType;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);

      oscRef.current = osc;
      setIsPlayingClient(true);

      setTimeout(() => {
        setIsPlayingClient(false);
      }, duration * 1000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleServerSynthesize = (e: React.FormEvent) => {
    e.preventDefault();
    onStartJob(
      `${lang === 'ar' ? 'توليد نغمة' : 'Acoustic Tone'} ${frequency}Hz (${waveType.toUpperCase()})`,
      'media_process',
      `RIFF_WAV:${frequency}Hz:${duration}s:${waveType}`,
      'wav',
      'Cross-Platform',
      {
        frequency,
        duration,
        waveType,
      }
    );
  };

  return (
    <div className="max-w-[1380px] mx-auto px-4 sm:px-8 py-8 space-y-10">
      {/* Title Header */}
      <div className="border-b border-[#454943] pb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#B76E45] text-[#F1EBDD] font-mono text-[10px] font-bold">
              STN-04 // ACOUSTIC FORGE WORKERS: WRK-13 & WRK-14
            </span>
            <span className="text-xs font-mono text-emerald-400">ENGINE: RIFF/WAV SYNTHESIZER (44.1kHz)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-mono uppercase text-[#F1EBDD]">
            {lang === 'ar' ? 'ورشة الصوتيات وتوليد WAV' : 'AUDIO & ACOUSTIC FORGE'}
          </h1>
          <p className="text-xs sm:text-sm text-[#AAA99F] font-mono mt-1">
            {lang === 'ar'
              ? 'توليد ملفات صوتية حقيقية بصيغة RIFF/WAV مع ترويسات بايتية قياسية، واختبار الذبذبات الترددية.'
              : 'Synthesize standard RIFF/WAV binary audio streams with authentic byte headers and frequency analysis.'}
          </p>
        </div>

        <div className="p-3 bg-[#292D2B] border border-[#454943] text-right font-mono text-xs">
          <span className="text-[#AAA99F] block text-[10px]">SAMPLING SPEC</span>
          <span className="text-[#C69B70] font-bold">44,100 Hz / 16-BIT PCM</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Matrix */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleServerSynthesize} className="p-6 border border-[#454943] bg-[#292D2B] space-y-6">
            <h3 className="text-base font-bold font-mono text-[#F1EBDD] border-b border-[#454943] pb-3 flex items-center gap-2">
              <Music className="w-4 h-4 text-[#B76E45]" />
              <span>{lang === 'ar' ? 'إعدادات الموجة الصوتية والتردد' : 'WAVEFORM & FREQUENCY GENERATOR'}</span>
            </h3>

            {/* Waveform Selector */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#AAA99F] mb-2">
                {lang === 'ar' ? 'نوع الموجة الصوتية:' : 'OSCILLATOR WAVEFORM TYPE:'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'sine', label: 'Sine Wave (نقية)' },
                  { id: 'square', label: 'Square Wave (مربعة)' },
                  { id: 'triangle', label: 'Triangle (مثلثة)' },
                  { id: 'sawtooth', label: 'Sawtooth (سن المنشار)' },
                ].map((wt) => (
                  <button
                    key={wt.id}
                    type="button"
                    onClick={() => setWaveType(wt.id as OscillatorType)}
                    className={`p-3 border text-center font-mono text-xs transition cursor-pointer ${
                      waveType === wt.id
                        ? 'border-[#B76E45] bg-[#B76E45] text-[#F1EBDD] font-bold'
                        : 'border-[#454943] bg-[#202322] text-[#AAA99F] hover:text-[#F1EBDD]'
                    }`}
                  >
                    {wt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Frequency Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-[#AAA99F] uppercase">
                  {lang === 'ar' ? 'التردد الصوتي (Hz):' : 'FREQUENCY (Hz):'}
                </span>
                <span className="text-lg font-bold text-[#F1EBDD] tabular-nums">{frequency} Hz</span>
              </div>
              <input
                type="range"
                min="50"
                max="2000"
                step="10"
                value={frequency}
                onChange={(e) => setFrequency(parseInt(e.target.value, 10))}
                className="w-full accent-[#B76E45] bg-[#202322] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#AAA99F] mt-1">
                <span>50 Hz (Deep Bass)</span>
                <span>440 Hz (Concert A)</span>
                <span>1000 Hz (Calibration)</span>
                <span>2000 Hz (High)</span>
              </div>
            </div>

            {/* Duration Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-[#AAA99F] uppercase">
                  {lang === 'ar' ? 'مدة النغمة (بالثواني):' : 'DURATION (SECONDS):'}
                </span>
                <span className="text-lg font-bold text-[#F1EBDD] tabular-nums">{duration}s</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                className="w-full accent-[#C69B70] bg-[#202322] cursor-pointer"
              />
            </div>

            {/* Action Buttons: Client Preview & Server Build */}
            <div className="pt-4 border-t border-[#454943] flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleClientPlay}
                className="px-5 py-3 border border-[#454943] hover:border-[#C69B70] text-[#F1EBDD] font-mono text-xs font-bold uppercase transition flex items-center gap-2 cursor-pointer"
              >
                {isPlayingClient ? (
                  <>
                    <Square className="w-4 h-4 text-red-400" />
                    <span>{lang === 'ar' ? 'إيقاف المعاينة' : 'STOP AUDIO'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-[#C69B70]" />
                    <span>{lang === 'ar' ? 'استماع فوري' : 'INSTANT PREVIEW'}</span>
                  </>
                )}
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 bg-[#B76E45] hover:bg-[#A65F3C] disabled:opacity-50 text-[#F1EBDD] font-mono font-bold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Flame className="w-4 h-4" />
                <span>
                  {isLoading
                    ? (lang === 'ar' ? 'جاري التوليد في WRK-13..14...' : 'SYNTHESIZING WAV FILE...')
                    : (lang === 'ar' ? 'توليد ملف WAV الفيزيائي وحفظه في الخزينة' : 'SYNTHESIZE & DELIVER WAV')}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Technical Specification Box */}
        <div className="space-y-6">
          <div className="p-6 border border-[#454943] bg-[#292D2B] space-y-4 font-mono text-xs">
            <h4 className="text-xs font-bold uppercase text-[#C69B70] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>RIFF/WAV SPECIFICATION</span>
            </h4>
            <div className="space-y-2 text-[#AAA99F] text-[11px]">
              <div>
                <strong>Container:</strong> Resource Interchange File Format (RIFF)
              </div>
              <div>
                <strong>Format:</strong> WAVE (WAVEform audio)
              </div>
              <div>
                <strong>Subchunk1:</strong> fmt (16 bytes, PCM format code 1)
              </div>
              <div>
                <strong>Sample Rate:</strong> 44,100 samples/sec
              </div>
              <div>
                <strong>Bit Depth:</strong> 16-bit Signed Integer (Little-Endian)
              </div>
              <div>
                <strong>Channels:</strong> 1 (Mono)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
