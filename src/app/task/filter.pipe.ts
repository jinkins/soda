import { Task } from './task';
import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from '../shared/auth.service';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  constructor(private as: AuthService) { }

  transform(value: Task[], query: string): Task[] {


    let matches: Task[] = [];

    if (query == '' || typeof (value) == 'undefined') {
      return value;
    }

    //   // assignee='Nicolas&priority=5'

    //   let q: string[]
    //   q = query.split('&');


    //   let matches = []

    //   for (let c of q) {
    //     // = 
    //     if (c.search('=') > 0) {
    //       let e = c.split('=');
    //       // If assignee 
    //       if (e[0] === 'assignee' || e[0] === 'a') {
    //         for (let item of value)
    //           if (item.assignee == e[1]) {
    //             matches.push(item)
    //           }
    //       }
    //     }
    //   }
    //   return matches;
    // }

    for (let t of value) {
      if (evaluate(query, t, this.as)) {
        matches.push(t);
      }
    }

    return matches;

  }
}

function evaluate(q: string, task: Task, as: AuthService): boolean {
  // Supprimer tous les sous query via les fonctions récursives



  let hasParentheses: boolean;
  let hasAnd: boolean;
  let hasOr: boolean;

  let regexParenthese = new RegExp(/\(|\)/);
  let regexParentheseAnd = new RegExp(/\)\&\(|\)\&\(?|\)?\&\(/);
  let regexParentheseOr = new RegExp(/\)\|\(|\)?\|\(|\)\|\(?/);
  let regexAnd = new RegExp(/\&/);
  let regexOr = new RegExp(/\|/);

  let t: boolean;

  if (regexParentheseAnd.test(q)) {
    let splitedq: string[] = q.split(regexParentheseAnd);
    if (splitedq.length > 1) {
      t = true;
      for (let sq of splitedq) {
        t = t && evaluate(sq, task, as);
      }
    }
  }

  else if (regexParentheseOr.test(q)) {
    let splitedq: string[] = q.split(regexParentheseOr);
    if (splitedq.length > 1) {
      t = false;
      for (let sq of splitedq) {
        t = t || evaluate(sq, task, as);
      }
    }
  }

  else if (regexAnd.test(q)) {
    let splitedq: string[] = q.split(regexAnd);
    if (splitedq.length > 1) {
      t = true;
      for (let sq of splitedq) {
        t = t && evaluate(sq, task, as);
      }
    }
  }

  else if (regexOr.test(q)) {
    let splitedq: string[] = q.split(regexOr);
    if (splitedq.length > 1) {
      t = false;
      for (let sq of splitedq) {
        t = t || evaluate(sq, task, as);
      }
    }
  }

  else { // primary

    q = q.replace(/^\(|\)$/, '');
    t = evaluateItem(q, task, as)
  }
  return t;
}

function evaluateItem(q: string, task: Task, as: AuthService): boolean {

  let assigneeRE = new RegExp(/^assignee=|^assignee!=|^a=|^a!=/);
  let priorityRE = new RegExp(/^prio|priority/);
  let deadlineRE = new RegExp(/^due|^deadline/);


  if (assigneeRE.test(q)) {

    let isEqual = new RegExp(/^assignee=|^a=/);
    let isNotEqual = new RegExp(/^assignee!=|^a!=/);

    let myID = as.getUid();

    if (isNotEqual.test(q)) {
      let sq = q.split(/!=/);

      if (sq[1] === "me") {
        sq[1] = myID;
      }

      if (task.getAssignee() != sq[1]) {
        return true;
      }
      else {
        return false;
      }
    }

    else if (isEqual.test(q)) {
      let sq = q.split(/=/);

      if (sq[1] === "me") {
        sq[1] = myID;
      }

      if (task.getAssignee() === sq[1]) {
        return true;
      }
      else {
        return false;
      }
    }

    else{
      return false; 
    }




  } // End of assignee test


  if (priorityRE.test(q)) {
    let isEqual = new RegExp(/priority=|prio=/);
    let isGreaterOrEqual = new RegExp(/priority>=|prio>=/);
    let isGreater = new RegExp(/priority>|prio>/);
    let isLowerOrEqual = new RegExp(/priority<=|prio<=/);
    let isLower = new RegExp(/priority<|prio</);
    let isNotEqual = new RegExp(/priority!=|prio!=/);

    // Evaluate or equal before 

    if (isEqual.test(q)) {
      q = q.replace(isEqual, '');

      if (task.getPriority() == Number(q)) {
        return true;
      }
      else {
        return false;
      }
    }

    else if (isGreaterOrEqual.test(q)) {
      q = q.replace(isGreaterOrEqual, '');

      if (task.getPriority() >= Number(q)) {
        return true;
      }
      else {
        return false;
      }
    }

    else if (isGreater.test(q)) {
      q = q.replace(isGreater, '');

      if (task.getPriority() > Number(q)) {
        return true;
      }
      else {
        return false;
      }
    }

    else if (isLowerOrEqual.test(q)) {
      q = q.replace(isLowerOrEqual, '');

      if (task.getPriority() <= Number(q)) {
        return true;
      }
      else {
        return false;
      }
    }
    else if (isLower.test(q)) {
      q = q.replace(isLower, '');

      if (task.getPriority() < Number(q)) {
        return true;
      }
      else {
        return false;
      }
    }
    else if (isNotEqual.test(q)) {
      q = q.replace(isNotEqual, '');

      if (task.getPriority() != Number(q)) {
        return true;
      }
      else {
        return false;
      }
    }
    else { // should never happens
      return false;
    }

  } // end of priority test

  else if(deadlineRE.test(q)) {
    let hasNoDL = new RegExp(/due=none|deadline=none/);
    let isEqual = new RegExp(/deadline=|due=/);
    let isGreaterOrEqual = new RegExp(/deadline>=|due>=/);
    let isGreater = new RegExp(/deadline>|due>/);
    let isLowerOrEqual = new RegExp(/deadline<=|due<=/);
    let isLower = new RegExp(/deadline<|due</);
    let isNotEqual = new RegExp(/deadline!=|due!=/);

    if(task.getDeadline() == null){
      if(hasNoDL.test(q)){
        return true; 
      }
      return false; 
    }

    // Evaluate or equal before 

    else if (isEqual.test(q)) {
      q = q.replace(isEqual, '');
      let due:Date = convertDate(q);

      if(due == null){
        return false; 
      }

      else if (task.diffDays(due) == 0) {
        return true;
      }
      else {
        return false;
      }
    }

    else if (isGreaterOrEqual.test(q)) {
      q = q.replace(isGreaterOrEqual, '');
      let due:Date = convertDate(q);

      if(due == null){
        return false; 
      }

      else if (task.diffDays(due) >= 0) {
        return true;
      }
      else {
        return false;
      }
    }

    else if (isGreater.test(q)) {
      q = q.replace(isGreater, '');
      let due:Date = convertDate(q);

      if(due == null){
        return false; 
      }

      else if (task.diffDays(due) > 0) {
        return true;
      }
      else {
        return false;
      }
    }

    else if (isLowerOrEqual.test(q)) {
      q = q.replace(isLowerOrEqual, '');
      let due:Date = convertDate(q);

      if(due == null){
        return false; 
      }

      else if (task.diffDays(due) <= 0) {
        return true;
      }
      else {
        return false;
      }
    }

    else if (isLower.test(q)) {
      q = q.replace(isLower, '');
      let due:Date = convertDate(q);

      if(due == null){
        return false; 
      }

      else if (task.diffDays(due) < 0) {
        return true;
      }
      else {
        return false;
      }
    }

    else if (isNotEqual.test(q)) {
      q = q.replace(isNotEqual, '');
      let due:Date = convertDate(q);

      if(due == null){
        return false; 
      }

      else if (task.diffDays(due) != 0) {
        return true;
      }
      else {
        return false;
      }
    }


    else { // should never happens
      return false;
    }

  } // end of deadline (due) test 

  


  else {
    return false;
  }

}

function convertDate(t:string): Date{
  let d:Date; 

  let joursRE = new RegExp(/\d{1,2}d/);

  if(t == 'today'){
    let dt = new Date();
    d = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 0,0,0,0);
  }

  else if(t == 'tomorrow'){
    let dt = new Date();
    d = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()+1, 0,0,0,0);
  }

  else if(t == 'yesterday'){
    let dt = new Date();
    d = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()-1, 0,0,0,0);
  }

  else if(joursRE.test(t)){
    let dt = new Date();
    let nj;
    nj = Number(t.match(/\d{1,2}/)[0]);
    d = d = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()+nj, 0,0,0,0);
  }

  else{
    d = null;
  }

  return d; 
}