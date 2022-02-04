defmodule Phoenixexample.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      Phoenixexample.Repo,
      # Start the Telemetry supervisor
      PhoenixexampleWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: Phoenixexample.PubSub},
      # Start the Endpoint (http/https)
      PhoenixexampleWeb.Endpoint
      # Start a worker by calling: Phoenixexample.Worker.start_link(arg)
      # {Phoenixexample.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Phoenixexample.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    PhoenixexampleWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
