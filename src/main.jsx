import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, CalendarCheck, Gift, Grid3X3, Lock, Search } from 'lucide-react';
import './styles.css';

const TOTAL = 6;
const eras = ['80年代', '90年代', '千禧年'];
const imageBase = import.meta.env.BASE_URL;
const titleArtImage = `${imageBase}images/find-difference-title-art-v2-transparent.png`;
const eraImages = {
  '80年代': `${imageBase}images/find-difference-80s-anachronism-wide-v1.png`,
  '90年代': `${imageBase}images/find-difference-90s-anachronism-wide-v1.png`,
  '千禧年': `${imageBase}images/find-difference-00s-anachronism-wide-v1.png`
};
const spots = [
  { id: 'radio', left: '18%', top: '43%', label: '不同点1' },
  { id: 'sign', left: '34%', top: '39%', label: '不同点2' },
  { id: 'drone', left: '52%', top: '30%', label: '不同点3' },
  { id: 'phone', left: '65%', top: '52%', label: '不同点4' },
  { id: 'rider', left: '80%', top: '58%', label: '不同点5' },
  { id: 'shop', left: '90%', top: '42%', label: '不同点6' }
];

const goods = [
  { icon: '🥟', title: '秦宝好适你商托迪饼官方综合装', price: 280, buyer: '2239人找着', hasChance: true },
  { icon: '🥤', title: '秦里享宏任务周菜溯蒲乳糖酸', price: 2.71, buyer: '5060人找着', hasChance: false },
  { icon: '🥖', title: '京东佳香苦酥适配方高清统造', price: 32.3, buyer: '1268人找着', hasChance: true },
  { icon: '📦', title: '汽车蒙西大包角趣味豪笔代东', price: 16.9, buyer: '3421人找着', hasChance: false },
  { icon: '🍜', title: '金山香油果丝汤面家庭尝鲜包', price: 8.8, buyer: '881人找着', hasChance: false },
  { icon: '🍪', title: '酸味最大量传傍包办公室零食', price: 3.6, buyer: '9127人找着', hasChance: true },
  { icon: '🥫', title: '复古铁盒饼干家庭分享装', price: 12.8, buyer: '2016人找着', hasChance: false },
  { icon: '🧃', title: '怀旧风味果汁整箱装', price: 25.9, buyer: '3390人找着', hasChance: true },
  { icon: '🍚', title: '东北长粒香米尝鲜袋', price: 19.9, buyer: '775人找着', hasChance: false },
  { icon: '🧼', title: '家用香皂洗护套装', price: 6.9, buyer: '4281人找着', hasChance: false },
  { icon: '🎧', title: '复古耳机收纳盒优惠装', price: 108, buyer: '650人找着', hasChance: false },
  { icon: '🧸', title: '怀旧玩具礼盒收藏款', price: 459, buyer: '198人找着', hasChance: false }
];

const filters = [
  { label: '全部', min: 0, max: Infinity },
  { label: '0~10元', min: 0, max: 10 },
  { label: '10~100元', min: 10, max: 100 },
  { label: '100~500元', min: 100, max: 500 }
];

function Toast({ message }) {
  return <div className={`toast ${message ? 'show' : ''}`}>{message}</div>;
}

function TopBar() {
  return (
    <div className="topbar">
      <button className="icon-btn" type="button" aria-label="返回"><ArrowLeft size={24} /></button>
      <button className="icon-btn" type="button" aria-label="更多">⋮</button>
    </div>
  );
}

function GameCard({ found, chances, activeEra, unlockedEraCount, onEraChange, onSpotClick, onOpenCheckin, onOpenTasks }) {
  return (
    <section className="game-card">
      <div className="tabs">
        {eras.map((era, index) => {
          const locked = index >= unlockedEraCount;
          return (
            <button key={era} className={`tab ${activeEra === era ? 'active' : ''} ${locked ? 'locked' : ''}`} onClick={() => onEraChange(era)} type="button">
              {locked && <Lock size={13} />} {era}
            </button>
          );
        })}
      </div>
      <div className="scene-wrap" onClick={() => onSpotClick(null)}>
        <img className="scene" src={eraImages[activeEra]} alt={`${activeEra}生活场景找不同玩法图`} />
        <div className="hotspot-layer">
          {spots.map(spot => (
            <button
              key={`${activeEra}-${spot.id}`}
              className={`hotspot ${found.has(spot.id) ? 'found' : ''}`}
              style={{ left: spot.left, top: spot.top }}
              onClick={event => {
                event.stopPropagation();
                onSpotClick(spot.id);
              }}
              aria-label={spot.label}
              type="button"
            />
          ))}
        </div>
        <div className="progress-ribbon">找到<span>{found.size}</span>/{TOTAL}个不同点，最高赢SVIP会员</div>
      </div>
      <div className="chance-row">
        <button className="side-task" onClick={onOpenCheckin} type="button">
          <span className="badge"><CalendarCheck size={22} /></span>签到有奖
        </button>
        <button className="play-btn" disabled={chances <= 0} type="button">剩余寻找机会 <span>{chances}</span>次</button>
        <button className="side-task" onClick={onOpenTasks} type="button">
          <span className="badge"><Gift size={22} /></span>得机会
        </button>
      </div>
    </section>
  );
}

function Mall({ onChanceRoll }) {
  const [activeFilter, setActiveFilter] = useState('全部');
  const [chanceStates, setChanceStates] = useState({});
  const currentFilter = filters.find(filter => filter.label === activeFilter) || filters[0];
  const filteredGoods = goods.filter(item => item.price >= currentFilter.min && item.price <= currentFilter.max);

  function handleChanceClick(title) {
    if (chanceStates[title]) return;
    const won = onChanceRoll();
    setChanceStates(value => ({ ...value, [title]: won ? 'won' : 'missed' }));
  }

  return (
    <section className="mall">
      <div className="search-row">
        <div className="search"><Search size={20} /><span>搜索</span></div>
        <Grid3X3 className="grid-icon" size={25} />
      </div>
      <div className="filters">
        {filters.map(filter => (
          <button key={filter.label} className={`filter ${activeFilter === filter.label ? 'active' : ''}`} onClick={() => setActiveFilter(filter.label)} type="button">
            {filter.label}
          </button>
        ))}
      </div>
      <div className="goods-scroll">
        <div className="goods">
          {filteredGoods.map(({ icon, title, price, buyer, hasChance }) => {
            const chanceState = chanceStates[title];
            const chanceText = chanceState === 'won' ? '已抽中 +1机会' : chanceState === 'missed' ? '未抽中' : '领取机会';
            return (
              <article className="goods-card" key={title}>
                <button className="goods-main" type="button">
                  <div className="pic">{icon}</div>
                  <div>
                    <div className="goods-title">{title}</div>
                    <div className="price">¥{price}</div>
                    <div className="buyer">{buyer}</div>
                  </div>
                </button>
                {hasChance && (
                  <button
                    className={`chance-pill ${chanceState ? `chance-pill-${chanceState}` : ''}`}
                    onClick={() => handleChanceClick(title)}
                    disabled={Boolean(chanceState)}
                    type="button"
                  >
                    {chanceText}
                  </button>
                )}
              </article>
            );
          })}
        </div>
        {!filteredGoods.length && <div className="empty-goods">当前价格区间暂无商品</div>}
      </div>
    </section>
  );
}

function RewardModal({ open, activeEra, onAgain, onNext }) {
  if (!open) return null;
  const hasNext = eras.indexOf(activeEra) < eras.length - 1;
  return (
    <div className="modal">
      <h2>挑战成功！</h2>
      <p>{activeEra}关卡已完成，获得一次SVIP抽奖资格。{hasNext ? '下一关已解锁。' : '全部关卡已通关。'}</p>
      <div className="modal-actions">
        <button onClick={onAgain} type="button">再玩一次</button>
        {hasNext && <button onClick={onNext} type="button">下一关</button>}
      </div>
    </div>
  );
}

function CheckinModal({ open, signedDays, onClose, onSign }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="checkin-modal" onClick={event => event.stopPropagation()}>
        <h2>7天签到</h2>
        <p>连续签到可获得更多寻找机会</p>
        <div className="calendar-grid">
          {Array.from({ length: 7 }, (_, index) => {
            const day = index + 1;
            const signed = signedDays.includes(day);
            return <div key={day} className={`calendar-day ${signed ? 'signed' : ''}`}><span>第{day}天</span><strong>{signed ? '已签' : '+1'}</strong></div>;
          })}
        </div>
        <div className="modal-actions">
          <button onClick={onClose} type="button">关闭</button>
          <button onClick={onSign} type="button">今日签到</button>
        </div>
      </div>
    </div>
  );
}

function TaskModal({ open, onClose, onComplete }) {
  if (!open) return null;
  const tasks = [
    { icon: '👥', title: '分享给好友助力', progress: '0/10', desc: '邀请好友参与互动' },
    { icon: '⏱️', title: '浏览主会场30s', progress: '0/30', desc: '完成任务得奖励' },
    { icon: '🛒', title: '购买20元以上商品', progress: '0/5', desc: '集合会场主推大于20元' },
    { icon: '🔍', title: '搜索心仪好物30s', progress: '0/5', desc: '搜索一件商品，逛货架拿奖励' },
    { icon: '🪐', title: '逛一逛包裹墙30s', progress: '0/3', desc: '双11包裹墙惊喜福利' }
  ];
  return (
    <div className="task-backdrop" onClick={onClose}>
      <button className="task-close" onClick={onClose} type="button">×</button>
      <div className="task-panel" onClick={event => event.stopPropagation()}>
        <div className="task-mascot">🧩🎁</div>
        <div className="task-title">做任务得机会</div>
        <div className="task-list">
          {tasks.map(task => (
            <div className="task-item" key={task.title}>
              <div className="task-icon">{task.icon}</div>
              <div className="task-copy">
                <strong>{task.title}<em>({task.progress})</em></strong>
                <span>{task.desc}</span>
              </div>
              <div className="task-action">
                <button onClick={onComplete} type="button">去完成</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [chances, setChances] = useState(3);
  const [foundByEra, setFoundByEra] = useState({});
  const [activeEra, setActiveEra] = useState('80年代');
  const [toast, setToast] = useState('');
  const [success, setSuccess] = useState(false);
  const [checkinOpen, setCheckinOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [signedDays, setSignedDays] = useState([]);
  const foundIds = foundByEra[activeEra] || [];
  const found = useMemo(() => new Set(foundIds), [foundIds]);
  const completedEraCount = eras.reduce((count, era) => (foundByEra[era] || []).length === TOTAL ? count + 1 : count, 0);
  const unlockedEraCount = Math.min(completedEraCount + 1, eras.length);

  function showToast(text) {
    setToast(text);
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => setToast(''), 1600);
  }

  function addChance(text) {
    setChances(value => value + 1);
    showToast(text);
  }

  function handleEraChange(era) {
    const targetIndex = eras.indexOf(era);
    if (targetIndex >= unlockedEraCount) {
      showToast(`请先完成${eras[targetIndex - 1]}关卡`);
      return;
    }
    setActiveEra(era);
    setSuccess(false);
    showToast(`${era}关卡已切换`);
  }

  function handleSpotClick(id) {
    if (!id) {
      showToast(chances <= 0 ? '机会不足，领取后继续找' : '再仔细看看画面里的异常元素');
      return;
    }
    if (found.has(id)) return;
    if (chances <= 0) {
      showToast('机会用完啦，去商品区领取');
      return;
    }
    const nextFound = [...foundIds, id];
    setFoundByEra(value => ({ ...value, [activeEra]: nextFound }));
    setChances(value => value - 1);
    showToast(`找到第 ${nextFound.length} 个不同点`);
    if (nextFound.length === TOTAL) {
      window.setTimeout(() => setSuccess(true), 450);
    }
  }

  function handleCheckin() {
    const nextDay = signedDays.length + 1;
    if (signedDays.length >= 7) {
      showToast('7天签到已全部完成');
      return;
    }
    setSignedDays(days => [...days, nextDay]);
    addChance(`第${nextDay}天签到成功，机会 +1`);
  }

  function handleChanceRoll() {
    const won = Math.random() < 0.2;
    if (won) {
      addChance('恭喜抽中，寻找机会 +1');
    } else {
      showToast('未抽中，本次未获得奖励');
    }
    return won;
  }

  function resetGame() {
    setFoundByEra(value => ({ ...value, [activeEra]: [] }));
    setChances(3);
    setSuccess(false);
  }

  function goNextEra() {
    const nextEra = eras[eras.indexOf(activeEra) + 1];
    if (nextEra) {
      setActiveEra(nextEra);
      setSuccess(false);
      showToast(`${nextEra}关卡已解锁`);
    }
  }

  return (
    <main className="phone">
      <TopBar />
      <section className="title">
        <img className="title-art" src={titleArtImage} alt="欢乐找不同 赢网盘豪礼" />
      </section>
      <GameCard
        found={found}
        chances={chances}
        activeEra={activeEra}
        unlockedEraCount={unlockedEraCount}
        onEraChange={handleEraChange}
        onSpotClick={handleSpotClick}
        onOpenCheckin={() => setCheckinOpen(true)}
        onOpenTasks={() => setTaskOpen(true)}
      />
      <div className="hint-strip">下滑寻找可获得更多「机会」</div>
      <Mall onChanceRoll={handleChanceRoll} />
      <Toast message={toast} />
      <RewardModal open={success} activeEra={activeEra} onAgain={resetGame} onNext={goNextEra} />
      <CheckinModal open={checkinOpen} signedDays={signedDays} onClose={() => setCheckinOpen(false)} onSign={handleCheckin} />
      <TaskModal open={taskOpen} onClose={() => setTaskOpen(false)} onComplete={handleChanceRoll} />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
