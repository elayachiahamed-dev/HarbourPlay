# Zero-install static server using macOS's built-in Ruby (no Node needed).
# Usage: ruby scripts/serve.rb [port]      → http://localhost:5173/
require 'webrick'

root = File.expand_path('..', __dir__)
port = (ARGV[0] || ENV['PORT'] || 5173).to_i

WEBrick::HTTPUtils::DefaultMimeTypes.merge!(
  'js' => 'text/javascript', 'mjs' => 'text/javascript', 'json' => 'application/json',
  'svg' => 'image/svg+xml', 'woff2' => 'font/woff2', 'ttf' => 'font/ttf'
)

server = WEBrick::HTTPServer.new(
  BindAddress: '127.0.0.1', Port: port, DocumentRoot: root,
  AccessLog: [], Logger: WEBrick::Log.new($stderr, WEBrick::Log::WARN)
)
# Never cache while developing.
server.config[:MimeTypes] = WEBrick::HTTPUtils::DefaultMimeTypes
class << server
  def service(req, res)
    super
    res['Cache-Control'] = 'no-store'
  end
end

trap('INT') { server.shutdown }
trap('TERM') { server.shutdown }
puts "Harbour Jackpot → http://localhost:#{port}/"
server.start
