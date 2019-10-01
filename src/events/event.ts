import Listener from "../listeners/listener";

abstract class Event {
    public listeners?: Listener[];
    
    public async run() {
        if (this.listeners.length > 0) {
            for (var i=0; i<this.listeners.length; i++) {
                const element = this.listeners[i];
                await element.handle(this);
            }
        }
    }
}

export default Event;