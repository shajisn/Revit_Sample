import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';

@Injectable()
export class EventsService implements IEventsService {
    private listeners: any;
    private eventsSubject: Subject<{}>;
    private events: Observable<any>;

    constructor() {
        this.listeners = {};
        this.eventsSubject = new Subject();

        this.events = Observable.from(this.eventsSubject);

        this.events.subscribe(
            ({ name, args }) => {
                if (this.listeners[name]) {
                    for (let listener of this.listeners[name]) {
                        listener(name, ...args);
                    }
                }
            });
    }

    public on(name, listener) {
        if (!this.listeners[name]) {
            this.listeners[name] = [];
        }

        this.listeners[name].push(listener);
    }

    public broadcast(name, ...args) {
        this.eventsSubject.next({
            name,
            args
        });
    }
}

export interface IEventsService {
    on(name, listener);
    broadcast(name, ...args);
}