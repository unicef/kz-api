import Listener from "../listeners/listener";

abstract class Event {
    public listeners?: Listener[];
    
    public async run() {
        if (this.listeners.length > 0) {
            this.listeners.forEach(element => {
                element.handle(this);
            });
        }
    }
}

export default Event;