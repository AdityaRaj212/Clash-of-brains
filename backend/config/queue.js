class Queue {
    constructor() {
        this.items = [];
    }

    enqueue(element) {
        this.items.push(element);
    }

    dequeue() {
        if (this.isEmpty()) return "Queue is empty";
        return this.items.shift();
    }

    includes(element) {
        return this.items.includes(element);
    }

    isEmpty() {
        return this.items.length === 0;
    }

    get length() {
        return this.items.length;
    }
}

export default new Queue();
