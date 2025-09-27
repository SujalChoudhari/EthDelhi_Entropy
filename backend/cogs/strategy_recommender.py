# # cogs/recommendation_router.py
# from fastapi import APIRouter
# from pydantic import BaseModel
# from typing import List, Dict
# from hyperon import *

# router = APIRouter()


# class UserProfile(BaseModel):
#     user_id: str
#     profile: str
#     asset_class: str
#     time_horizon: str
#     liquidity: str
#     experience: str
#     interest: str
#     excludes: List[str] = []


# @router.post("/recommend", tags=["Recommendations"])
# def recommend(user: UserProfile) -> Dict:
#     metta = MeTTa()

#     # Add user data to MeTTa
#     metta.space().add_atom(
#         E(S("HAS_PROFILE"), S(user.user_id), ValueAtom(user.profile))
#     )
#     metta.space().add_atom(
#         E(S("PREFERS_ASSET_CLASS"), S(user.user_id), ValueAtom(user.asset_class))
#     )
#     metta.space().add_atom(
#         E(S("SEEKS_TIME_HORIZON"), S(user.user_id), ValueAtom(user.time_horizon))
#     )
#     metta.space().add_atom(
#         E(S("HAS_LIQUIDITY"), S(user.user_id), ValueAtom(user.liquidity))
#     )
#     metta.space().add_atom(
#         E(S("HAS_EXPERIENCE"), S(user.user_id), ValueAtom(user.experience))
#     )
#     metta.space().add_atom(
#         E(S("HAS_INTEREST"), S(user.user_id), ValueAtom(user.interest))
#     )

#     # Exclusions
#     for ex in user.excludes:
#         metta.space().add_atom(E(S("EXCLUDES_STRATEGY"), S(user.user_id), S(ex)))

#     strategies_data = [
#         (
#             "s1",
#             "Moderate",
#             "LargeCapCrypto",
#             "Medium-term",
#             "Bullish",
#             "RSI",
#             1.5,
#             True,
#             0.9,
#         ),
#         (
#             "s2",
#             "Aggressive",
#             "MidCapCrypto",
#             "Short-term",
#             "Volatile",
#             "MACD",
#             2.0,
#             False,
#             0.8,
#         ),
#         (
#             "s3",
#             "Conservative",
#             "Stablecoins",
#             "Long-term",
#             "Sideways",
#             "VWAP",
#             1.0,
#             True,
#             0.95,
#         ),
#         (
#             "s4",
#             "High-Degenerate",
#             "DeFi",
#             "Short-term",
#             "Volatile",
#             "Stochastic",
#             3.0,
#             True,
#             0.7,
#         ),
#         ("s5", "Moderate", "NFTs", "Medium-term", "Bullish", "MACD", 1.2, False, 0.85),
#         (
#             "s6",
#             "Aggressive",
#             "LargeCapCrypto",
#             "Medium-term",
#             "Bearish",
#             "RSI",
#             2.5,
#             True,
#             0.95,
#         ),
#     ]

#     for (
#         s_id,
#         risk,
#         asset,
#         horizon,
#         market,
#         indicator,
#         perf,
#         is_new,
#         rep,
#     ) in strategies_data:
#         metta.space().add_atom(E(S("HAS_RISK_PROFILE"), S(s_id), ValueAtom(risk)))
#         metta.space().add_atom(E(S("TRADES_ASSET_CLASS"), S(s_id), ValueAtom(asset)))
#         metta.space().add_atom(E(S("HAS_HOLDING_PERIOD"), S(s_id), ValueAtom(horizon)))
#         metta.space().add_atom(
#             E(S("OPERATES_IN_MARKET_CONDITION"), S(s_id), ValueAtom(market))
#         )
#         metta.space().add_atom(E(S("USES_INDICATOR"), S(s_id), S(indicator)))
#         metta.space().add_atom(E(S("HAS_PERFORMANCE"), S(s_id), ValueAtom(perf)))
#         metta.space().add_atom(E(S("IS_NEW"), S(s_id), ValueAtom(is_new)))
#         metta.space().add_atom(E(S("HAS_REPUTATION"), S(s_id), ValueAtom(rep)))

#     metta.space().add_atom(E(S("CurrentMarket"), ValueAtom("Bullish")))

#     def get_atom_value(atom):
#         mt = atom.get_metatype()
#         if mt.name == "VALUE":
#             return atom.value
#         elif mt.name == "SYMBOL":
#             return atom.get_name()
#         else:
#             return str(atom)

#     def calculate_score(user_id, strategy):
#         score = 0.0
#         # Risk
#         user_risk = get_atom_value(
#             metta.space().query(E(S("HAS_PROFILE"), S(user_id), V("r")))[0]["r"]
#         )
#         strategy_risk = get_atom_value(
#             metta.space().query(E(S("HAS_RISK_PROFILE"), S(strategy), V("r")))[0]["r"]
#         )
#         score += 2.0 if user_risk == strategy_risk else 1.0

#         # Asset
#         user_asset = get_atom_value(
#             metta.space().query(E(S("PREFERS_ASSET_CLASS"), S(user_id), V("a")))[0]["a"]
#         )
#         strategy_asset = get_atom_value(
#             metta.space().query(E(S("TRADES_ASSET_CLASS"), S(strategy), V("a")))[0]["a"]
#         )
#         score += 2.0 if user_asset == strategy_asset else 0.5

#         # Time horizon
#         user_horizon = get_atom_value(
#             metta.space().query(E(S("SEEKS_TIME_HORIZON"), S(user_id), V("t")))[0]["t"]
#         )
#         strategy_period = get_atom_value(
#             metta.space().query(E(S("HAS_HOLDING_PERIOD"), S(strategy), V("t")))[0]["t"]
#         )
#         score += 1.5 if user_horizon == strategy_period else 0.5

#         # Indicator
#         user_interest = get_atom_value(
#             metta.space().query(E(S("HAS_INTEREST"), S(user_id), V("i")))[0]["i"]
#         )
#         strategy_indicator = get_atom_value(
#             metta.space().query(E(S("USES_INDICATOR"), S(strategy), V("ind")))[0]["ind"]
#         )
#         if strategy_indicator.lower() == user_interest.lower():
#             score += 1.0

#         # Market
#         market = get_atom_value(
#             metta.space().query(E(S("CurrentMarket"), V("m")))[0]["m"]
#         )
#         strategy_market = get_atom_value(
#             metta.space().query(
#                 E(S("OPERATES_IN_MARKET_CONDITION"), S(strategy), V("m"))
#             )[0]["m"]
#         )
#         if market == strategy_market:
#             score += 1.0

#         # Performance
#         perf = float(
#             get_atom_value(
#                 metta.space().query(E(S("HAS_PERFORMANCE"), S(strategy), V("p")))[0][
#                     "p"
#                 ]
#             )
#         )
#         score += 0.5 * perf

#         # New & popular
#         is_new = get_atom_value(
#             metta.space().query(E(S("IS_NEW"), S(strategy), V("n")))[0]["n"]
#         )
#         rep = float(
#             get_atom_value(
#                 metta.space().query(E(S("HAS_REPUTATION"), S(strategy), V("r")))[0]["r"]
#             )
#         )
#         if is_new and rep > 0.7:
#             score += 1.0

#         # Exclusions
#         exclusions = [
#             get_atom_value(atom["r"])
#             for atom in metta.space().query(
#                 E(S("EXCLUDES_STRATEGY"), S(user_id), V("r"))
#             )
#         ]
#         if strategy in exclusions:
#             score = 0.0

#         return min(score, 10.0)

#     strategy_ids = [s[0] for s in strategies_data]
#     recommendations = []
#     for s in strategy_ids:
#         score = calculate_score(user.user_id, s)
#         recommendations.append({"strategy": s, "score": round(score, 2)})

#     recommendations.sort(key=lambda x: x["score"], reverse=True)
#     return {"recommendations": recommendations}
