import Event from "../events/event";

abstract class Listener {
    abstract async handle(event: Event): Promise<void>;
}

export default Listener;