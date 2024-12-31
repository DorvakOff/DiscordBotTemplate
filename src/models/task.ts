export default abstract class Task {

    protected timeout?: NodeJS.Timeout;
    protected delay: number;
    protected stopped: boolean = false;

    constructor(delay: number) {
        this.delay = delay * 1000;
    }

    protected abstract run(): Promise<void>;

    public start() {
        this.stopped = false;
        this.timeout = setTimeout(() => {
            if (!this.stopped) this.run();
        }, this.delay);
    }

    public stop() {
        clearTimeout(this.timeout);
        this.timeout = undefined;
        this.stopped = true;
    }
}
