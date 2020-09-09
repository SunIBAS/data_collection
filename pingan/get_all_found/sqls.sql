- 筛选出前 100 个最多基金持有的股票，对应 sheet1
select count(*) as total,* from found GROUP BY found.code order by total desc limit 0,100