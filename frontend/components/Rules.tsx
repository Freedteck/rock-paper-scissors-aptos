import rules from "@/assets/image-rules.svg";
import close from "@/assets/icon-close.svg";
import React from "react";

type RulesProps = {
  setShowRules: (showRules: boolean) => void;
};
const Rules: React.FC<RulesProps> = ({ setShowRules }) => {
  return (
    <div className="rules">
      <div>
        <div className="action">
          <h2>RULES</h2>
          <button onClick={() => setShowRules(false)}>
            <img src={close} alt="close" />
          </button>
        </div>
        <img src={rules} alt="game rules" />
      </div>
    </div>
  );
};

export default Rules;
