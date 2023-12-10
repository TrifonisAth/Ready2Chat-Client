export class Person {
  private id: number;
  private name: string;

  constructor(personDTO: any) {
    this.id = personDTO.id;
    this.name = personDTO.name;
  }

  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }
}
