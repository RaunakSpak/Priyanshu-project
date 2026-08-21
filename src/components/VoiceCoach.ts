export class VoiceCoach {
  private synth = window.speechSynthesis;
  private lastMessage = "";

  speak(message: string) {
    if (!message || message === this.lastMessage) return;
    
    // Cancel any ongoing speech so feedback is immediate
    this.synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 1.1;
    utterance.pitch = 1.0;
    
    this.synth.speak(utterance);
    this.lastMessage = message;
  }
  
  reset() {
    this.lastMessage = "";
  }
}

export const voiceCoach = new VoiceCoach();
