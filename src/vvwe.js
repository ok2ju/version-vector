const Version = require('./version')

class VVwE {
  constructor (siteId) {
    this.local = new Version(siteId)
    this.vector = []
    this.vector.push(this.local)
  }

  increment () {
    this.local.increment()
  }

  update (version) {
    const v = this.vector.find(ver => ver.siteId === version.siteId)

    if (!v) {
      const newVersion = new Version(version.siteId)
      newVersion.update(version.counter)
      this.vector.push(newVersion)
    } else {
      v.update(version.siteId)
    }
  }

  isApplied (version) {
    if (typeof version === 'undefined' || version === null) {
      return true
    }

    const v = this.vector.find(ver => ver.siteId === version.siteId)

    if (!v) {
      return false
    }

    return version.counter <= v.counter &&
      v.exceptions.indexOf(version.siteId) < 0
  }
}

module.exports = VVwE
