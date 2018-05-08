if (!localStorage.username) {
  localStorage.username = 'Alex B.';
}
username = localStorage.username;
VIEW.toPostFeed();
VIEW.updateHeader();
CONTROLLER.subscribeToUpdates();
