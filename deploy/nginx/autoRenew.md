<!-- No need to say -->

killall crond

<!-- -b: background, -l: log, 8: log detail level, -L: log file location -->

crond -b -l 8 -L /var/log/cron.log

<!-- Verify -->

ps aux | grep crond

<!-- Open schedule -->

crontab -e

<!-- Add this line -->

30 2 \* \* \* certbot renew --quiet && nginx -s reload

<!-- Check log -->

tail -f /var/log/cron.log
