import { Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OfflineService {
  private isOnlineSubject = new BehaviorSubject<boolean>(navigator.onLine);
  public isOnline$ = this.isOnlineSubject.asObservable();

  constructor(private swUpdate: SwUpdate) {
    this.monitorOnlineStatus();
    
    this.checkForUpdates();
  }

  private monitorOnlineStatus(): void {
    fromEvent(window, 'online').subscribe(() => {
      this.isOnlineSubject.next(true);
    });

    fromEvent(window, 'offline').subscribe(() => {
      this.isOnlineSubject.next(false);
    });
  }

  private checkForUpdates(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(
          filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
        )
        .subscribe(() => {
          if (confirm('A new version is available. Do you want to reload the page?')) {
            window.location.reload();
          }
        });
    }
  }

  public get isOnline(): boolean {
    return this.isOnlineSubject.value;
  }
}
