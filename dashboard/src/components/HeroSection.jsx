import React from "react";

const HeroSection = () => {
  return (
    <section
      className="relative h-screen text-white px-4 sm:px-6 overflow-hidden bg-no-repeat bg-cover bg-center flex flex-col"
      style={{
        backgroundImage: 'url("/agents/bglanding.png")',
      }}
    >
      {/* Radial Glow */}
      <div
        className="absolute top-20 left-1/2 transform -translate-x-1/2 w-[80%] h-[300px] rounded-full opacity-30 blur-[100px] pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle at center, #D8FF86 0%, #95BF3B 40%, transparent 80%)',
        }}
      />

      {/* Top Bar */}
      <div className="flex justify-between items-center relative z-10 pt-10">
        <img src="/agents/coinFantasylogo.png" alt="logo" className="h-8" />

        {/* CTA Buttons */}
        <button
          onClick={() => {
            const section = document.getElementById("community");
            if (section) section.scrollIntoView({ behavior: "smooth" });
          }}
          className="hidden sm:inline-block px-5 py-2 rounded-full text-black font-mono uppercase text-sm bg-gradient-to-r from-lime-300 to-yellow-300 hover:from-lime-200 hover:to-yellow-200 transition"
        >
          JOIN OUR COMMUNITY
        </button>

        <button
          onClick={() => {
            const section = document.getElementById("community");
            if (section) section.scrollIntoView({ behavior: "smooth" });
          }}
          className="sm:hidden px-4 py-2 rounded-full text-black font-mono uppercase text-xs bg-gradient-to-r from-lime-300 to-yellow-300 hover:from-lime-200 hover:to-yellow-200 transition"
        >
          JOIN NOW
        </button>
      </div>

      {/* Headline + Paragraph */}
      <div className="text-center relative z-10 mt-6">
        <h1
          className="text-xl sm:text-2xl md:text-4xl lg:text-5xl tracking-wide leading-snug flex flex-wrap justify-center gap-x-4 gap-y-2"
          style={{ fontFamily: '"Press Start 2P", cursive', color: '#D8FF86' }}
        >
          <span className="text-white">Create.</span>
          <span className="text-white">Breed.</span>
          <span className="text-white">Evolve.</span>
        </h1>

        <p className="text-white text-sm mt-4 max-w-2xl mx-auto leading-relaxed font-mono">
          Coinfantasy AI transforms wallet into mindshare driven AI characters <br />
          built on-chain trained by signals powered by your instincts
        </p>
      </div>

      {/* Fills Remaining Space with Image */}
   <div className="mt-5 flex justify-center relative z-10">
        <div className="rounded-2xl overflow-hidden shadow-xl max-w-6xl w-full px-2">
          {/* Desktop Image (sm and up) */}
          <img
            src="/agents/herosection.png"
            alt="hero-agent-desktop"
            className="hidden sm:block w-full h-auto object-cover rounded-2xl max-h-[580px]"
          />

          {/* Mobile Image */}
          <img
            src="/agents/herosectionmob.png"
            alt="hero-agent-mobile"
            className="block sm:hidden w-auto mx-auto h-[55vh] max-h-[420px] object-cover rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
