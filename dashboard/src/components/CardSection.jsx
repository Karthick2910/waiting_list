import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import "./App.css"

const agents = [
  {
    username: "@bery145",
    roi: "84.5% ROI (7D)",
    mindshare: "12.3%",
    img: "/agents/intelligent1.png",
  },
  {
    username: "@sandra25",
    roi: "84.5% ROI (7D)",
    mindshare: "12.3%",
    img: "/agents/intelligent2.png",
  },
  {
    username: "@sandra25",
    roi: "84.5% ROI (7D)",
    mindshare: "12.3%",
    img: "/agents/intelligent3.png",
  },
  {
    username: "@sandra25",
    roi: "84.5% ROI (7D)",
    mindshare: "12.3%",
    img: "/agents/intelligent4.png",
  },
];

const CardSection = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className="px-6 py-10 bg-black text-white font-mono">
      <h2 className="text-[15px] uppercase tracking-widest text-white mb-5">
        INTELLIGENT AI AGENTS LAUNCHING SOON
      </h2>

      {isClient && (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={50}
          slidesPerView={1.1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 1500,
            disableOnInteraction: false,
          }}
          loop={true}
          breakpoints={{
            640: { slidesPerView: 1.5 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 2.5 },
            1280: { slidesPerView: 3 },
          }}
        >
          {agents.map((agent, i) => (
           <SwiperSlide key={i}>
  <div className="w-[90vw] sm:w-[450px] h-[160px] sm:h-[180px] bg-[#1a1a1a] rounded-xl p-3 sm:p-4 shadow-inner border border-neutral-800 flex items-center space-x-2 ">
    <img
      src={agent.img}
      alt={`Agent ${i}`}
      className="w-[100px] h-[120px] sm:w-[130px] sm:h-[150px] object-cover rounded-lg"
    />

    <div className="flex-1">
      <div className="flex justify-between items-start mb-1">
        <p className="text-sm sm:text-sm font-semibold">{agent.username}</p>
        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#2e2e2e] rounded-full flex items-center justify-center text-gray-400 text-xs sm:text-sm">
          ↗
        </div>
      </div>

      {/* ROI */}
      <p className="text-xs text-gray-400 flex items-center gap-1 mb-1 sm:mb-2">
        <span className="text-red-400">📈</span> {agent.roi}
      </p>

      {/* Precision Tags */}
      <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
       <span className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-[11px] px-2 py-0.5 bg-[#2a2a2a] rounded-full text-gray-300">
         <img src="/agents/precision.png" alt="precision" className="w-3 h-3 sm:w-4 sm:h-4"/> Precision
       </span>

       <span className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-[11px] px-2 py-0.5 bg-[#2a2a2a] rounded-full text-gray-300">
         <img src="/agents/precision.png" alt="precision" className="w-3 h-3 sm:w-4 sm:h-4"/> Precision
       </span>
        <span className="text-[10px] sm:text-[11px] px-2 py-0.5 bg-[#2a2a2a] rounded-full text-gray-300">+2 more</span>
      </div>

      {/* Mindshare + Graph */}
      <div className="flex justify-between items-end mb-1 sm:mb-2">
        <div>
          <p className="text-[10px] sm:text-[12px] text-gray-500 mb-0.5">Mindshare</p>
          <p className="text-green-400 font-bold text-xs sm:text-sm">{agent.mindshare}</p>
        </div>
        <img
          src="/agents/chart.png"
          alt="sparkline"
          className="w-24 sm:w-28 h-6 sm:h-8 object-contain"
        />
      </div>

      {/* Followers & Chats */}
      <div className="flex gap-3 sm:gap-4 text-[11px] sm:text-[12px] text-gray-400 mt-1 sm:mt-2">
        <div className="flex items-center gap-1">
          <img src="/agents/followers.png" alt="followers" className="w-4 h-4" />
          <span>12.7k followers</span>
        </div>
        <div className="flex items-center gap-1">
          <img src="/agents/Chat.png" alt="chats" className="w-4 h-4" />
          <span>1.7k chats</span>
        </div>
      </div>
    </div>
  </div>
</SwiperSlide>


          ))}
        </Swiper>
      )}
    </section>
  );
};

export default CardSection;
