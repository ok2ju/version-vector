class Vector {
  constructor (siteId) {
    this.siteId = siteId
    this.counter = 0
    this.exceptions = []
  }

  increment () {
    this.counter += 1
  }

  update (counter) {
    if (counter < this.counter) {
      const index = this.exceptions.indexOf(counter)
      if (index >= 0) {
        this.exceptions.splice(index, 1)
      }
    }

    if (counter === (this.counter + 1)) {
      this.counter += 1
    }

    if (counter > (this.counter + 1)) {
      for (let i = this.counter + 1; i < counter; ++i) {
        this.exceptions.push(i)
      }
      this.counter = counter
    }
  }
}

module.exports = Vector
