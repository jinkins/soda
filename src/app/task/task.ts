export class Task {

    private id: string;
    private title: string;
    private description?: string;
    private priority: number;
    private deadline?: Date;

    constructor(i: string, t: string, d: string, p: number, dl: Date) {
        this.id = i;
        this.title = t;
        this.description = d;
        this.priority = p;
        this.deadline = dl;
    }

    getId() {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    getDescription(): string {
        return this.description;
    }

    getDeadline(): Date {
        return this.deadline;
    }

    getPriority(): number {
        return this.priority;
    }

    setDeadlineFromISO(t) {
        if (t) {
            let year = Number(t.substring(0, 4));
            let mois = Number(t.substring(5, 7));
            let jours = Number(t.substring(8, 10));
            this.deadline = new Date(Date.UTC(year, mois - 1, jours, 0, 0, 0, 0));
        }
        else {
            this.deadline = null;
        }

    }

    setTitle(t: string){
        this.title = t; 
    }

    setDescription(t: string){
        this.description = t; 
    }

    setPriority(t:any){
        if(typeof(t) == "string" ){
            this.priority = Number(t);
        }
        else{
            this.priority = t; 
        }
    }

    setId(id:string){
        this.id = id; 
    }

    diffDays(d: Date): number {
        if (this.deadline) {
            let timeDiff: number = this.deadline.getTime() - d.getTime();
            let diffDays: number = Math.floor(timeDiff / (1000 * 3600 * 24));
            return diffDays;
        }
        else {
            return null;
        }
    }

    deadlineStatusStyle(): string { // return the style class to apply regarding the deadline status
        let daysLeft = this.deadlineDaysLeft();

        if (daysLeft < 0) {
            return "label label-danger";
        }
        else if (daysLeft < 2) {
            return "label label-warning";
        }

        else if (daysLeft < 8) {
            return "label label-info";
        }

        return "label label-success";

    }

    deadlineDaysLeft(): number { // return a number regading the number of days left before the deadline
        let today: Date = new Date();
        today.setHours(0);              // Remove the hours to keep it at midnight so that the diff day is correctly computed. 
        today.setMinutes(0);            // Remove the minutes
        today.setSeconds(0);            // Remove the secondes
        today.setMilliseconds(0);       // Remove the milisecondes
        return this.diffDays(today);
    }

    deadlineDaysLeftText(t: Task): string { // return a text regading the number of days left before the deadline
        let daysLeft = this.deadlineDaysLeft();
        if (daysLeft < 0) {
            return "Overdue"
        }
        else if (daysLeft == 0) {
            return "Due today";
        }

        else if (daysLeft == 1) {
            return "Due tomorrow";
        }

        else if (daysLeft > 1) {
            return "Due in " + daysLeft + "days";
        }


    }
}
