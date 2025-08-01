import React from "react";

const Footer = () => {
  return (
    <footer
      className="relative text-center py-12 sm:py-16 overflow-hidden bg-black bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: "url('/agents/footer.png')" }}
    >
      {/* Content wrapper */}
      <div className="relative z-10 max-w-xl mx-auto px-4 text-white mt-60">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="/agents/coinFantasylogo.png"
            alt="CoinFantasy Logo"
            className="w-32 h-14 sm:w-40 sm:h-16 object-contain"
          />
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm mb-4 leading-relaxed">
          The first character AI + copy trading platform for Web3. Turn every wallet into a talkable AI agent.
        </p>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 sm:gap-6 text-white text-lg mt-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
    <img
      src="/agents/fb.png"
      alt="Facebook"
      className="w-8 h-8 sm:w-10 sm:h-10 hover:opacity-80 transition"
    />
     </a>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
    <img
      src="/agents/instagram.png"
      alt="Instagram"
      className="w-8 h-8 sm:w-10 sm:h-10 hover:opacity-80 transition"
    />
     </a>
    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
    <img
      src="/agents/X.png"
      alt="Twitter"
      className="w-8 h-8 sm:w-10 sm:h-10 hover:opacity-80 transition"
    />
    </a>
        </div>
      </div>

      {/* Title */}
      <div className="relative overflow-hidden h-[4rem] sm:h-[6rem] mt-8 sm:mt-8 z-10">
        <div
          className="text-center text-[2.8rem] sm:text-[5rem] md:text-[6.4rem] font-bold tracking-[0.2em] sm:tracking-[0.35em] text-[#e7e7f6] select-none sm: mt-6"
          style={{ fontFamily: '"Press Start 2P", cursive',

            // fontSize: 'clamp(1.6rem, 1vw, 1rem)',
           }}
        >
          COINFANTASY
        </div>
      </div>
    </footer>
  );
};

export default Footer;
