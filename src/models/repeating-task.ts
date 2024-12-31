import Task from "./task";

export default abstract class RepeatingTask extends Task {

    public start() {
        this.run();
        this.timeout = setInterval(() => {
            if (!this.stopped) this.run();
        }, this.delay);
    }

    public stop() {
        clearInterval(this.timeout);
        this.timeout = undefined;
        this.stopped = true;
    }
}
