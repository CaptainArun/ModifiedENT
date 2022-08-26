import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'triage-updateProgressNotes',
  templateUrl: 'triage-updateProgressNotes.component.html'
})

export class TriageUpdateProgressNotesComponent implements OnInit {
  selected = 'option1';
  disableSelect = true;
  

  constructor() { }

  ngOnInit() {}
}
