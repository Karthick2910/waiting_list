import { useNavigate } from 'react-router-dom';

const BetaInvite = () => {
  const navigate = useNavigate();

  const handleAccessClick = () => {
    navigate('/access');
  };

  return (
    <section
      id="community"
      className="px-6 py-16 md:py-24 text-white"
      style={{
        background: 'linear-gradient(135deg, #1c0536 0%, #060606 60%, #0f1a0f 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">

        {/* Left Image Container */}
        <div className="w-full md:w-1/2">
          <div className="bg-gradient-to-br from-[#1c0536] to-[#060606] rounded-2xl p-6 shadow-xl">
            <img
              src={`/agents/trailer.png`}
              alt="Orbit graphics"
              className="w-full rounded-xl"
            />
          </div>
        </div>

        {/* Right Text Content */}
        <div className="w-full md:w-1/2 text-center md:text-left space-y-6">

          {/* Gradient badge */}
          <div
            className="inline-block text-white text-sm px-4 py-1 rounded-full font-bold tracking-wide shadow-md h-8"
            style={{
              background: 'linear-gradient(90deg, #FF7433 0%, #FF0000 100%)',
              fontFamily: 'monospace'
            }}
          >
            🔥 Only 1000 Slots left!!
          </div>

          <h2
            className="text-5xl md:text-4xl font-bold font-mono text-gray-100"
            style={{ fontFamily: '"Press Start 2P", cursive' }}
          >
            Join the Beta
          </h2>

          <p className="text-white-400 text-sm tracking-wide uppercase"
            style={{ fontFamily: 'monospace' }}>
            Create, Chat, Challenge & Earn
          </p>

          <button
            onClick={handleAccessClick}
            className="px-5 py-2 rounded-full text-black font-[DM Mono] uppercase text-sm bg-gradient-to-r from-lime-300 to-yellow-300 hover:from-lime-200 hover:to-yellow-200 transition"
            style={{ fontFamily: 'monospace' }}
          >
            REQUEST EARLY ACCESS
          </button>
        </div>
      </div>
    </section>
  );
};

export default BetaInvite;
