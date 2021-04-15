import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

interface Tweet{
  username: string,
  content: string,
  hashtag: string[]
}

interface ChipColor {
  name: string;
  color: ThemePalette;
}

@Component({
  selector: 'app-twitter',
  templateUrl: './twitter.component.html',
  styleUrls: ['./twitter.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('.5s ease-out', style({ opacity: '1' })),
      ]),
    ]),
  ],
})
export class TwitterComponent implements OnInit, OnDestroy  {

  selectable = true;
  removable = true;

  newSequence: string = '';

  textExample: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat';
  hashtagExample: string[] = ['#UCN','#PRAGMATIC','#ULS','#DBZ'];
  
  tweetList: Tweet[] = [];

  availableColors: ChipColor[] = [
    {name: 'word1', color: undefined},
    {name: 'word2', color: 'primary'},
    {name: 'word3', color: 'accent'},
    {name: 'word4', color: 'warn'}
  ];

  timeToGenerate: number = 20;
  timerGenerate: number = this.timeToGenerate;

  generateTweetInterval = setInterval(() => { 
    if(this.timerGenerate > 0){
      this.timerGenerate--;
    }else{
      this.generateTweet();
    }
  } , 1000);

  rules = [
    'Add seed',
    'Kill creators',
    'Keep seed'
  ];

  constructor() { }

  ngOnInit(): void {
    for(let i=0; i < 4; i++){
      this.generateTweet();
    }
  }

  addSequence(){
    if(this.newSequence === "") return;
    this.availableColors.unshift(
      {
        name: this.newSequence,
        color: undefined
      }
    );
    this.newSequence = "";
  }

  remove(chip: string): void {
    const index = this.availableColors.findIndex(item => item.name == chip);

    if (index >= 0) {
      this.availableColors.splice(index, 1);
    }
  }

  generateTweet(){
    this.timerGenerate = this.timeToGenerate;
    this.tweetList.unshift({
      username: 'PLeger',
      content: this.textExample.substring(0, this.getRandomInt(this.textExample.length)),
      hashtag: [this.hashtagExample[this.getRandomInt(this.hashtagExample.length)]]
    });
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  ngOnDestroy() {
    clearInterval(this.generateTweetInterval);
  }

}
