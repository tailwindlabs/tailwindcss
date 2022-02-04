defmodule Phoenixexample.Repo do
  use Ecto.Repo,
    otp_app: :phoenixexample,
    adapter: Ecto.Adapters.Postgres
end
