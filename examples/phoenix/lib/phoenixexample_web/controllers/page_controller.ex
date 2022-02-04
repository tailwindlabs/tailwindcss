defmodule PhoenixexampleWeb.PageController do
  use PhoenixexampleWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
