export default class IdGenerator {
    static id = 0;

    static getId() {
        return this.id++;
    }
}