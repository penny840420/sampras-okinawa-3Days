import { motion } from 'motion/react';
import { TRIP_DATA } from '../data/tripData';
import { Sun, Cloud, CloudRain, Thermometer, Wind, Umbrella, AlertTriangle } from 'lucide-react';

const weatherIcons: Record<string, any> = {
  '晴': Sun,
  '陰': Cloud,
  '雨': CloudRain,
};

export const WeatherTab = ({ activeDay }: { activeDay: number }) => {
  const day = TRIP_DATA.find((d) => d.day === activeDay);

  if (!day) return null;

  const WeatherIcon = weatherIcons[day.weather.condition];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-3xl p-8 sketch-border hard-shadow-black text-center relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-coral/20 rounded-full blur-3xl opacity-50" />
        
        <p className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-2">{day.city} · {day.date}</p>
        
        <div className="flex flex-col items-center justify-center my-6 relative z-10">
           <div className="p-6 bg-brand-peach/50 rounded-full mb-4 border border-brand-black/5 rotate-[-3deg]">
              <WeatherIcon size={64} className="text-brand-black" strokeWidth={1.5} />
           </div>
           <h2 className="text-4xl font-black tracking-tight">{day.weather.condition}</h2>
           <div className="flex gap-4 mt-4 text-xl font-bold" translate="no">
              <span className="text-brand-black">{day.weather.temp.max}°</span>
              <span className="text-brand-black/40">{day.weather.temp.min}°</span>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-8 relative z-10">
           <div className="bg-brand-bg p-4 rounded-2xl border border-brand-black/10">
              <div className="flex items-center gap-2 mb-1 justify-center opacity-40">
                <Umbrella size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">降雨機率</span>
              </div>
              <p className="font-bold text-lg">{day.weather.rainProb}</p>
           </div>
           <div className="bg-brand-bg p-4 rounded-2xl border border-brand-black/10">
              <div className="flex items-center gap-2 mb-1 justify-center opacity-40">
                <Wind size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">風速</span>
              </div>
              <p className="font-bold text-lg">良好</p>
           </div>
        </div>
      </div>

      {/* Special Reminders (Paper Fragment Look) */}
      <div className="bg-brand-peach sketch-border rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] relative overflow-hidden rotate-[1deg]">
         {/* Decorative "Coffee Stain" or simple circle */}
         <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-brand-black/5 rounded-full" />
         
         <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-brand-black rounded-xl text-white">
               <AlertTriangle size={20} />
            </div>
            <h4 className="font-bold text-brand-black">重要注意</h4>
         </div>
         <ul className="text-[10px] space-y-2 text-brand-black/70 font-medium leading-relaxed">
            <li>• {day.day === 5 ? "阿蘇火山目前開放中，請注意火山氣體" : "近期紫外線較強，記得定時補充防曬"}</li>
            <li>• 山區及海邊體感溫度較低，防風外套不可少</li>
         </ul>
      </div>

      {/* Hourly Weather Simulation */}
      <div className="bg-white rounded-3xl p-5 sketch-border">
         <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4 px-1">時段預報</h4>
         <div className="flex justify-between overflow-x-auto gap-6 pb-2 scrollbar-hide no-scrollbar">
            {[9, 12, 15, 18, 21].map(hour => (
              <div key={hour} className="flex flex-col items-center shrink-0">
                <span className="text-[10px] opacity-40 font-bold mb-2">{hour}:00</span>
                <Sun size={20} strokeWidth={1.5} />
                <span className="text-sm font-bold mt-2" translate="no">24°</span>
              </div>
            ))}
         </div>
      </div>
    </motion.div>
  );
};
