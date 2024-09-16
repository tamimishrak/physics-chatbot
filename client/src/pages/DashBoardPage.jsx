import React from 'react'

export default function DashBoardPage() {
  return (
    <div className="dashboardPage">
      <div className="texts">
        <div className="logo">
          <h1>PhyMate</h1>
        </div>
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <input type="text" name="text" placeholder="Ask me anything..." />
          <button>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
      </div>
    </div>
  )
}
