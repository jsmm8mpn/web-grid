import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-profile',
  styleUrl: 'app-profile.css',
  shadow: false
})
export class AppProfile {

  render() {
    return (
      <div class="app-profile">
        <p>
          Hello! My name was passed in
          through a route param!
        </p>
      </div>
    );
  }
}
