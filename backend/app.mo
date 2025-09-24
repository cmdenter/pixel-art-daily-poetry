import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Int "mo:base/Int";
import LLM "mo:llm";

actor PoetryBackend {
    
    stable var currentPoem : Text = "";
    stable var lastPoemDate : Int = 0;
    stable var poemCount : Nat = 0;

    // Get current day as number (days since epoch)
    private func getCurrentDay() : Int {
        Time.now() / (24 * 60 * 60 * 1_000_000_000);
    };

    public func getDailyPoem() : async Text {
        let today = getCurrentDay();
        
        // If we already have today's poem, return it
        if (lastPoemDate == today and currentPoem != "") {
            return currentPoem;
        };
        
        // Generate new poem for today
        let poemPrompt = "Write a beautiful, contemplative poem about nature, life, or human emotions. Make it thoughtful and inspiring, around 8-12 lines. Just return the poem without any introduction or explanation.";
        let newPoem = await LLM.prompt(#Llama3_1_8B, poemPrompt);
        
        // Store the new poem
        currentPoem := newPoem;
        lastPoemDate := today;
        poemCount += 1;
        
        return newPoem;
    };

    public func getCurrentPoem() : async Text {
        if (currentPoem == "") {
            return await getDailyPoem();
        };
        return currentPoem;
    };

    public func getPoemCount() : async Nat {
        return poemCount;
    };

    public func getLastUpdateDate() : async Int {
        return lastPoemDate;
    };
};
