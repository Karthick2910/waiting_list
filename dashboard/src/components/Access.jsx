import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import AIAgent from "./AI_Agent";
import { GoogleLogin } from "@react-oauth/google";
import { ConnectButton } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { useActiveAccount } from "thirdweb/react";
import { client } from "../Client";

const steps = [
  "Connect Your Account",
  "Link X Handle",
  "Follow CF on Twitter",
  "Create Your Agent",
  "Share on Twitter to Jump the line",
];

const prioritizeWallets = [
  createWallet("io.metamask"),
  createWallet("com.hashpack.wallet"),
  createWallet("com.trustwallet.app"),
  createWallet("app.phantom"),
  createWallet("com.coinbase.wallet"),
];

// Storage keys for persistence
const STORAGE_KEYS = {
  CURRENT_STEP: 'cf_access_current_step',
  TWITTER_USER_DATA: 'cf_twitter_user_data',
  SESSION_ID: 'cf_session_id',
  FOLLOW_COMPLETE: 'cf_follow_complete',
  GENERATED_IMAGE: 'cf_generated_image',
  WALLET_CONNECTED: 'cf_wallet_connected',
  GOOGLE_AUTHENTICATED: 'cf_google_authenticated'
};

const Access = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFollowComplete, setIsFollowComplete] = useState(false);
  const [walletUIVisible, setWalletUIVisible] = useState(false);
  const [twitterAuthInProgress, setTwitterAuthInProgress] = useState(false);
  const [twitterUserData, setTwitterUserData] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [checkingFollowStatus, setCheckingFollowStatus] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  const account = useActiveAccount();

  const DEV_MODE = false;

  // Load saved progress on component mount
  useEffect(() => {
    loadSavedProgress();
    window.scrollTo(0, 0);

    // Listen for messages from Twitter OAuth popup
    const handleMessage = (event) => {
      if (event.origin !== "http://localhost:3001") return;

      if (event.data.type === "TWITTER_LOGIN_COMPLETE") {
        console.log("Twitter login completed:", event.data);
        setTwitterAuthInProgress(false);

        // Store user data and session ID
        const userData = {
          username: event.data.username,
          userId: event.data.userId,
        };
        setTwitterUserData(userData);
        setSessionId(event.data.sessionId);

        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.TWITTER_USER_DATA, JSON.stringify(userData));
        localStorage.setItem(STORAGE_KEYS.SESSION_ID, event.data.sessionId);

        // Complete step 1 (Twitter login) and save progress
        const newStep = 2;
        setCurrentStep(newStep);
        localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, newStep.toString());
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // Load saved progress from localStorage
  const loadSavedProgress = () => {
    try {
      const savedStep = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
      const savedTwitterData = localStorage.getItem(STORAGE_KEYS.TWITTER_USER_DATA);
      const savedSessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
      const savedFollowComplete = localStorage.getItem(STORAGE_KEYS.FOLLOW_COMPLETE);
      const savedGeneratedImage = localStorage.getItem(STORAGE_KEYS.GENERATED_IMAGE);

      if (savedStep) {
        setCurrentStep(parseInt(savedStep));
      }

      if (savedTwitterData) {
        setTwitterUserData(JSON.parse(savedTwitterData));
      }

      if (savedSessionId) {
        setSessionId(savedSessionId);
      }

      if (savedFollowComplete === 'true') {
        setIsFollowComplete(true);
      }

      if (savedGeneratedImage) {
        setGeneratedImage(savedGeneratedImage);
      }
    } catch (error) {
      console.error('Error loading saved progress:', error);
    }
  };

  // Save progress to localStorage
  const saveProgress = (step, additionalData = {}) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, step.toString());
      
      // Save any additional data passed
      Object.entries(additionalData).forEach(([key, value]) => {
        if (STORAGE_KEYS[key]) {
          localStorage.setItem(STORAGE_KEYS[key], 
            typeof value === 'object' ? JSON.stringify(value) : value.toString()
          );
        }
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  // Clear saved progress (optional - call when user completes all steps)
  const clearSavedProgress = () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  };

  useEffect(() => {
    if (DEV_MODE) {
      setTwitterUserData({ username: "bypass_user", userId: "123456" });
      setSessionId("dev-session");
      setIsFollowComplete(true);
      setCurrentStep(3);
    }
  }, []);

  // Function to check follow status
  const checkFollowStatus = async () => {
    if (!sessionId) return;

    setCheckingFollowStatus(true);
    try {
      const response = await fetch(
        `http://localhost:3001/check-follow-status/${sessionId}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.isFollowing) {
          setIsFollowComplete(true);
          const newStep = 3;
          setCurrentStep(newStep);
          
          // Save progress
          saveProgress(newStep, { FOLLOW_COMPLETE: 'true' });
        } else {
          alert(
            "You have not followed @Coinfantasy_Io yet. Please follow them first and try again."
          );
        }
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "Failed to check follow status"}`);
      }
    } catch (error) {
      console.error("Error checking follow status:", error);
      alert("Error checking follow status. Please try again.");
    } finally {
      setCheckingFollowStatus(false);
    }
  };

  const handleContinue = (walletInfo = null) => {
    let newStep = currentStep;

    if (currentStep === 0) {
      // Save wallet connection or Google auth progress
      if (walletInfo) {
        localStorage.setItem(STORAGE_KEYS.WALLET_CONNECTED, 'true');
      } else {
        localStorage.setItem(STORAGE_KEYS.GOOGLE_AUTHENTICATED, 'true');
      }
      newStep = 1;
    } else if (currentStep === 1) {
      // Open Twitter OAuth in new tab
      setTwitterAuthInProgress(true);
      const popup = window.open(
        "http://localhost:3001/auth/twitter",
        "_blank",
        "width=600,height=700"
      );

      // Check if popup was blocked
      if (!popup || popup.closed || typeof popup.closed === "undefined") {
        alert(
          "Popup blocked! Please allow popups for this site and try again."
        );
        setTwitterAuthInProgress(false);
        return;
      }

      // Optional: Check if popup is closed manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          setTwitterAuthInProgress(false);
        }
      }, 1000);

      return; // Don't increment step here, it will be handled by the message listener
    } else if (currentStep < steps.length - 1) {
      newStep = currentStep + 1;
    }

    setCurrentStep(newStep);
    saveProgress(newStep);
  };

  const renderStepCircle = (index) => {
    if (index < currentStep) {
      return (
        <div
          className="w-10 h-10 rounded-full text-black font-bold flex items-center justify-center text-sm"
          style={{ backgroundColor: "#D8FF86" }}
        >
          ✓
        </div>
      );
    }

    return (
      <div
        className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
        style={{
          borderColor: index === currentStep ? "#D8FF86" : "#666666",
        }}
      >
        {index === currentStep && (
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: "#D8FF86" }}
          />
        )}
      </div>
    );
  };

  const getButtonLabel = () => {
    if (currentStep === 0) return "Continue with Google";
    if (currentStep === 1)
      return twitterAuthInProgress ? "Connecting..." : "Continue with Twitter";
    if (currentStep === 2)
      return checkingFollowStatus ? "Checking..." : "Check Follow Status";
    if (currentStep === 3) return "Create Agent";
    if (currentStep === 4) return "Share on Twitter";
    return "Continue";
  };

  const getButtonIcon = () => {
    if (currentStep === 0)
      return "https://www.svgrepo.com/show/475656/google-color.svg";
    if ([1, 2, 4].includes(currentStep))
      return "https://www.svgrepo.com/show/183608/twitter.svg";
    return null;
  };

  const renderContent = () => {
    if (currentStep === 0) {
      return walletUIVisible ? (
        renderWalletUI()
      ) : (
        <>
          <h2
            className="font-mono text-sm mb-2 uppercase tracking-wide"
            style={{ color: "#D8FF86" }}
          >
            JOIN THE AI REVOLUTION
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Let's introduce your Agent to the world!
          </p>
          <ConnectButton
            client={client}
            onConnect={(walletInfo) => {
              console.log("Connected wallet:", walletInfo);
              handleContinue(walletInfo);
            }}
            wallets={prioritizeWallets}
            connectButton={{
              label: (
                <div className="w-100 h-10 flex items-center justify-center gap-3 bg-black text-white py-2 rounded-full font-medium hover:bg-gray-900 transition mb-4 font-[space-grotest]">
                  <img
                    src="./agents/wallet.png"
                    alt="Wallet"
                    className="w-4 h-4"
                  />
                  <span>Connect Wallet</span>
                </div>
              ),
              className: "bg-transparent border-none shadow-none",
              style: {
                backgroundColor: "transparent",
              },
            }}
          />

          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-700"></div>
            <span className="mx-3 text-sm text-gray-500 font-mono">or</span>
            <div className="flex-grow h-px bg-gray-700"></div>
          </div>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              console.log("Google Login Success:", credentialResponse);
              handleContinue();
            }}
            onError={() => alert("Google Login Failed")}
            width="100%"
            border="10px"
            border-radius="10px"
          />
        </>
      );
    }

    if (currentStep === 1) {
      return (
        <>
          <h2
            className="font-mono text-sm mb-2 uppercase tracking-wide"
            style={{ color: "#D8FF86" }}
          >
            CONNECT TWITTER
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Connect your Twitter account to continue
          </p>
          <button
            onClick={handleContinue}
            disabled={twitterAuthInProgress}
            className={`w-full flex items-center justify-center text-base gap-3 py-2 rounded-full font-medium transition ${
              twitterAuthInProgress
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-white text-black hover:bg-gray-100"
            }`}
            style={{ fontFamily: "monospace" }}
          >
            {!twitterAuthInProgress && (
              <img src="/agents/xlogo.png" alt="Twitter" className="w-5 h-5" />
            )}
            {twitterAuthInProgress ? "Connecting to X..." : "Link X Handle"}
          </button>
          {twitterAuthInProgress && (
            <p className="text-gray-500 text-xs mt-2">
              Please complete the authentication in the popup window.
            </p>
          )}
        </>
      );
    }

    if (currentStep === 2) {
      return (
        <>
          <h2
            className="font-mono text-xs sm:text-sm mb-2 uppercase tracking-wide text-center"
            style={{ color: "#D8FF86" }}
          >
            FOLLOW COINFANTASY ON X
          </h2>

          <p className="text-gray-400 text-xs sm:text-sm mb-6 text-center px-2">
            {twitterUserData
              ? `Connected as @${twitterUserData.username}`
              : "Game-changing updates, and on-chain power plays."}
          </p>

          <div className="w-full bg-gradient-to-br from-[#1c1c1c] to-[#0f0f0f] p-3 sm:p-4 rounded-xl shadow-lg text-white mb-6 mx-auto max-w-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 rounded-lg gap-3 sm:gap-0">
              <div className="flex items-center space-x-3">
                <img
                  src="/agents/cflogo.png"
                  alt="CoinFantasy"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-semibold">CoinFantasy</p>
                  <p className="text-xs text-gray-400">@Coinfantasy_Io</p>
                </div>
              </div>
              <button
                onClick={() =>
                  window.open("https://x.com/Coinfantasy_Io", "_blank")
                }
                className="px-5 py-2 w-30 rounded-full text-black font-[DM Mono] uppercase text-sm bg-gradient-to-r from-lime-300 to-yellow-300 hover:from-lime-200 hover:to-yellow-200 transition"
                style={{ fontFamily: "monospace" }}
              >
                FOLLOW
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              const newStep = 3;
              setCurrentStep(newStep);
              saveProgress(newStep);
            }}
            className={`w-full flex items-center justify-center gap-2 sm:gap-3 py-2 rounded-full font-medium transition ${
              checkingFollowStatus
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-lime-400 text-black hover:bg-lime-500"
            }`}
          >
            I Have Followed - Continue
          </button>

          <p className="text-gray-500 text-[10px] sm:text-xs mt-2 text-center px-2">
            Follow @Coinfantasy_Io on Twitter, then click the button above to
            verify and continue.
          </p>
        </>
      );
    }

    if (currentStep === 3) {
      return (
        <AIAgent
          onAgentComplete={() => {
            const newStep = 4;
            setCurrentStep(newStep);
            saveProgress(newStep);
          }}
          setGeneratedImage={(imageUrl) => {
            setGeneratedImage(imageUrl);
            localStorage.setItem(STORAGE_KEYS.GENERATED_IMAGE, imageUrl);
          }}
        />
      );
    }

    const handleShareWithImage = async () => {
      if (!sessionId || !generatedImage) {
        // Fallback to simple text tweet if no session or image
        const tweetText = encodeURIComponent(
          "Just created my AI agent with @Coinfantasy_Io! The future of on-chain intelligence is here 🚀 #CoinFantasy #AI #Web3"
        );
        window.open(
          `https://twitter.com/intent/tweet?text=${tweetText}`,
          "_blank"
        );
        const newStep = 5;
        setCurrentStep(newStep);
        saveProgress(newStep);
        // Clear progress after completion
        setTimeout(() => clearSavedProgress(), 1000);
        return;
      }

      try {
        // Show loading state
        const shareButton = document.querySelector(".share-button");
        if (shareButton) {
          shareButton.textContent = "SHARING...";
          shareButton.disabled = true;
        }

        const response = await fetch("http://localhost:3001/tweet-with-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: sessionId,
            imageUrl: generatedImage,
            tweetText:
              "Just created my AI agent with @Coinfantasy_Io! The future of on-chain intelligence is here 🚀 #CoinFantasy #AI #Web3",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          alert("Successfully shared your agent on Twitter! 🎉");
          console.log("Tweet posted with ID:", data.tweetId);
          
          // Complete the flow
          const newStep = 5;
          setCurrentStep(newStep);
          saveProgress(newStep);
          // Clear progress after successful completion
          setTimeout(() => clearSavedProgress(), 1000);
        } else {
          const errorData = await response.json();
          console.error("Error posting tweet:", errorData);

          // Fallback to manual sharing
          const tweetText = encodeURIComponent(
            "Just created my AI agent with @Coinfantasy_Io! The future of on-chain intelligence is here 🚀 #CoinFantasy #AI #Web3"
          );
          window.open(
            `https://twitter.com/intent/tweet?text=${tweetText}`,
            "_blank"
          );
          const newStep = 5;
          setCurrentStep(newStep);
          saveProgress(newStep);
          setTimeout(() => clearSavedProgress(), 1000);
        }
      } catch (error) {
        console.error("Error sharing tweet:", error);

        // Fallback to manual sharing
        const tweetText = encodeURIComponent(
          "Just created my AI agent with @Coinfantasy_Io! The future of on-chain intelligence is here 🚀 #CoinFantasy #AI #Web3"
        );
        window.open(
          `https://twitter.com/intent/tweet?text=${tweetText}`,
          "_blank"
        );
        const newStep = 5;
        setCurrentStep(newStep);
        saveProgress(newStep);
        setTimeout(() => clearSavedProgress(), 1000);
      } finally {
        // Reset button state
        const shareButton = document.querySelector(".share-button");
        if (shareButton) {
          shareButton.textContent = "SHARE MY AGENT";
          shareButton.disabled = false;
        }
      }
    };

    if (currentStep === 4) {
      return (
        <div className="text-center">
          {/* Header */}
          <h2
            className="font-mono text-sm mb-2 uppercase tracking-wide"
            style={{ color: "#D8FF86" }}
          >
            YOUR AGENT IS LIVE!!
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Let's introduce your Agent to the world!
          </p>

          {/* Agent Image Card */}
          <div className="mx-auto w-[180px] bg-black rounded-xl p-2 mb-4 shadow-lg border border-[#2c2c2c]">
            {generatedImage ? (
              <img
                src={generatedImage}
                alt="Your Agent"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-sm text-gray-400">No image available.</div>
            )}
          </div>

          {/* Share Button */}
          <button
            onClick={handleShareWithImage}
            className="share-button bg-[#D8FF86] text-black py-2 px-6 rounded-full font-semibold text-sm hover:bg-lime-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            SHARE MY AGENT
          </button>

          {/* Optional: Manual share fallback */}
          <p className="text-gray-500 text-xs mt-2">
            Having trouble?{" "}
            <button
              onClick={() => {
                const tweetText = encodeURIComponent(
                  "Just created my AI agent with @Coinfantasy_Io! The future of on-chain intelligence is here 🚀 #CoinFantasy #AI #Web3"
                );
                window.open(
                  `https://twitter.com/intent/tweet?text=${tweetText}`,
                  "_blank"
                );
                const newStep = 5;
                setCurrentStep(newStep);
                saveProgress(newStep);
                setTimeout(() => clearSavedProgress(), 1000);
              }}
              className="text-[#D8FF86] underline hover:text-lime-300"
            >
              Share manually
            </button>
          </p>
        </div>
      );
    }

    // Final completion step
    if (currentStep === 5) {
      return (
        <div className="text-center">
          <h2
            className="font-mono text-sm mb-2 uppercase tracking-wide"
            style={{ color: "#D8FF86" }}
          >
            CONGRATULATIONS!
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            You've successfully completed the onboarding process!
          </p>
          <button
            onClick={() => {
              clearSavedProgress();
              window.location.href = '/';
            }}
            className="bg-[#D8FF86] text-black py-2 px-6 rounded-full font-semibold text-sm hover:bg-lime-300 transition"
          >
            GO TO DASHBOARD
          </button>
        </div>
      );
    }
  };

  // Inside the return block of Access.js:

  // At the bottom of Access.js
  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 md:px-8 py-10 text-white">
      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row w-full px-4 lg:px-8 rounded-xl overflow-hidden bg-[#0f0f0f] shadow-lg">
        {/* Stepper Left */}
        <div className="w-full lg:w-1/3 bg-[#111111] py-10 px-4 sm:px-6">
          <Link to="/"> 
            <p className="text-sm mb-10 font-mono flex items-center gap-2">
              <img src="agents/back.svg" className="w-4 h-4" alt="back icon" />
              Join the Future of on Chain Intelligence
            </p>
          </Link>
          <div className="flex flex-col space-y-0">
            {steps.map((step, index) => (
              <div key={index} className="flex space-x-4">
                <div className="flex flex-col items-center">
                  {renderStepCircle(index)}
                  {index < steps.length - 1 && (
                    <div
                      className="w-px h-10 lg:h-16"
                      style={{ backgroundColor: "#D8FF86" }}
                    />
                  )}
                </div>
                <div>
                  <p
                    className="text-sm leading-tight font-mono"
                    style={{
                      color:
                        index === currentStep || index < currentStep
                          ? "#D8FF86"
                          : "#666",
                    }}
                  >
                    STEP {index + 1}
                    <br />
                    {step}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Right */}
        <div
          className={`w-full lg:w-2/3 overflow-y-auto ${
            currentStep === 3
              ? "p-0"
              : "py-16 px-6 sm:px-8 lg:px-10 flex justify-center items-center"
          }`}
          style={{
            background:
              currentStep === 3
                ? "#0f0f0f"
                : `radial-gradient(ellipse at 30% 20%, rgba(216, 255, 134, 0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 80%, rgba(216, 255, 134, 0.05) 0%, transparent 50%),
                linear-gradient(135deg, #1c1c1c 0%, #0f0f0f 100%)`,
          }}
        >
          {currentStep === 3 ? (
            <div className="w-full h-[calc(100vh-6rem)] overflow-y-auto">
              {renderContent()}
            </div>
          ) : (
            <div
              className="rounded-xl px-6 sm:px-10 py-8 text-center w-full max-w-md shadow-2xl relative z-10 backdrop-blur-sm"
              style={{
                background: `radial-gradient(ellipse at 40% 30%, rgba(216, 255, 134, 0.06) 0%, transparent 60%),
                radial-gradient(ellipse at 60% 70%, rgba(216, 255, 134, 0.04) 0%, transparent 60%),
                linear-gradient(145deg, #1f1f1f 0%, #181818 50%, #141414 100%)`,
              }}
            >
              <div
                className="absolute inset-0 rounded-xl opacity-20"
                style={{
                  background: `conic-gradient(from 180deg at 50% 50%, 
                      transparent 0deg, 
                      rgba(216, 255, 134, 0.02) 90deg, 
                      transparent 180deg, 
                      rgba(216, 255, 134, 0.03) 270deg, 
                      transparent 360deg)`,
                }}
              />
              <div className="relative z-10">{renderContent()}</div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5">
        <Footer />
      </div>
    </div>
  );
};

export default Access;