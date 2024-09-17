import React from 'react'

import "./DashBoardPage.css"

export default function DashBoardPage() {
  return (
    <div className="dashboardPage">
      <div className="texts">
        <div className="logo">
          <h1>PhyMate</h1>
        </div>
      </div>
      <div className="formContainer">
        <form>
          <input type="text" name="text" placeholder="Ask me anything..." />
          <button>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
      </div>
    </div>
  )
}
