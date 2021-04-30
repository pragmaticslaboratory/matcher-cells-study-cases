import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css']
})
export class TweetComponent implements OnInit {

  @Input() username: string;
  @Input() content: string;
  @Input() hashtags: string[];
  @Input() match: boolean = false;
  @Input() total: number = 0;
  constructor() { }

  ngOnInit(): void {
  }

}
