import { useState } from "react";

const steps = [
  { title: "STEP 1", text: "Connect Google Auth" },
  { title: "STEP 2", text: "Connect Twitter" },
  { title: "STEP 3", text: "Follow CF on Twitter" },
  { title: "STEP 4", text: "Mint Your WNNFT for Free" },
  { title: "STEP 5", text: "Share on Twitter to Jump the line" },
];

const Leaderboard = () => {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <section className="bg-black text-white text-center py-20 px-4 font-mono">
      <h2 className="text-3xl md:text-5xl font-bold mb-12 leading-snug text-[#f3f3f3]" style={{ fontFamily: '"Press Start 2P", cursive' }}>
        Join the Future of on <br />
        <span className="text-white">Chain Intelligence</span>
      </h2>

      <div className="flex justify-center flex-wrap gap-4 md:gap-6 max-w-6xl mx-auto ml">
        {steps.map((step, index) => {
          const status =
            index < currentStep
              ? "completed"
              : index === currentStep
              ? "active"
              : "upcoming";

          return (
            <div
              key={index}
              className="flex flex-col items-center text-sm relative cursor-pointer"
              onClick={() => setCurrentStep(index)}
            >
              {/* Step Circle */}
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-200 
                  ${
                    status === "completed"
                      ? "bg-lime-300 text-black"
                      : status === "active"
                      ? "border-2 border-lime-300 text-lime-300"
                      : "border-2 border-gray-700 text-gray-500"
                  }
                `}
              >
                {status === "completed" ? "✓" : status === "active" ? "●" : ""}
              </div>

              {/* Title */}
              <div className="text-xs mt-2 font-semibold text-white">{step.title}</div>

              {/* Description */}
              <p
                className={`mt-1 text-xs text-center max-w-[8rem] ${
                  status === "completed"
                    ? "text-lime-300"
                    : status === "active"
                    ? "text-white"
                    : "text-gray-500"
                }`}
              >
                {step.text}
              </p>

              {/* Line to next step (only on desktop) */}
              {index < steps.length - 1 && (
                <div className="absolute top-6 right-[-3rem] w-20 h-0.5 bg-lime-300 hidden md:block"></div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Leaderboard;
