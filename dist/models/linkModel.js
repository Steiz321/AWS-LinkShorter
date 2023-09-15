"use strict";
class LinkModel {
    constructor(obj) {
        this.id = obj.id;
        this.originalLink = obj.originalLink;
        this.shortenedLink = obj.shortenedLink;
        this.isActive = true;
        this.visits = 0;
    }
}
