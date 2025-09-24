// import Debug "mo:base/Debug"; // Unused import
import Text "mo:base/Text";
import Time "mo:base/Time";
import Int "mo:base/Int";
import LLM "mo:llm";

persistent actor PoetryBackend {
    
    stable var currentPoem : Text = "";
    stable var currentPoemTitle : Text = "";
    stable var lastPoemDate : Int = 0;
    stable var poemCount : Nat = 0;

    // Get current day as number (days since epoch)
    private func getCurrentDay() : Int {
        Time.now() / (24 * 60 * 60 * 1_000_000_000);
    };

    public func getDailyPoem() : async {poem: Text; title: Text} {
        let today = getCurrentDay();
        
        // If we already have today's poem, return it
        if (lastPoemDate == today and currentPoem != "") {
            return {poem = currentPoem; title = currentPoemTitle};
        };
        
        // Generate new poem for today
        let poemPrompt = "Write a beautiful, contemplative poem about nature, life, or human emotions. Make it thoughtful and inspiring, around 8-12 lines. Just return the poem without any introduction or explanation.";
        let newPoem = await LLM.prompt(#Llama3_1_8B, poemPrompt);
        
        // Generate a title for the poem
        let titlePrompt = "Create a short, poetic title (2-4 words) for this poem: " # newPoem # ". Just return the title without quotes or explanation.";
        let newTitle = await LLM.prompt(#Llama3_1_8B, titlePrompt);
        
        // Store the new poem and title
        currentPoem := newPoem;
        currentPoemTitle := newTitle;
        lastPoemDate := today;
        poemCount += 1;
        
        return {poem = newPoem; title = newTitle};
    };

    public func getCurrentPoem() : async {poem: Text; title: Text} {
        if (currentPoem == "") {
            return await getDailyPoem();
        };
        return {poem = currentPoem; title = currentPoemTitle};
    };

    public func getPoemCount() : async Nat {
        return poemCount;
    };

    public func getLastUpdateDate() : async Int {
        return lastPoemDate;
    };
};
